import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProductsService } from '../products.service';
import { Products } from '../products';
import { ScategoriesService } from '../../scategories/scategories.service'
import { Scategories } from '../../scategories/scategories'
import { FilePondComponent } from 'ngx-filepond';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  @ViewChild('myModal') myModal!: ElementRef;
  @ViewChild('myPond') myPond: FilePondComponent;

  display = "none";

  products: Products = new Products();
  scategories!: Scategories[];

  constructor(private prodserv: ProductsService, private scatserv: ScategoriesService) { }

  ngOnInit() {
    this.loadscategorie();
  }

  loadscategorie() {
    this.scatserv.getAll().subscribe({
      next: data => this.scategories = data,
      error: err => console.log(err)
    });
  }

  ajoutarticle = () => {
    this.prodserv.create(this.products).subscribe({
      next: data => {
        console.log(data);
        this.closeModal();
        window.location.reload();
      },
      error: err => console.error(err)
    });
  }

  openModal() {
    this.display = "block";
  }

  closeModal() {
    this.display = "none";
  }

  pondOptions = {
    class: 'my-filepond',
    multiple: false,
    labelIdle: 'Drop files here or <span class="filepond--label-action">Browse</span>',
    acceptedFileTypes: ['image/jpeg', 'image/png'],
    server: {
      process: (fieldName: any, file: any, metadata: any, load: any, error: any, progress: any, abort: any) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'w8mbiznb'); // Your Cloudinary unsigned preset
        data.append('public_id', file.name);
        data.append('cloud_name', 'dgdxk31bg'); // This is optional if using public endpoint

        fetch('https://api.cloudinary.com/v1_1/dgdxk31bg/image/upload', {
          method: 'POST',
          body: data
        })
        .then(response => response.json())
        .then(res => {
          console.log('Upload success:', res);
          this.products.imageart = res.secure_url;
          load(res);
        })
        .catch(err => {
          console.error('Upload failed:', err);
          error('Upload failed');
          abort();
        });

        return {
          abort: () => {
            console.log('Upload aborted');
            abort();
          }
        };
      },
      revert: (uniqueFileId: any, load: any, error: any) => {
        console.log('File reverted:', uniqueFileId);
        load();
      }
    }
  }

}
