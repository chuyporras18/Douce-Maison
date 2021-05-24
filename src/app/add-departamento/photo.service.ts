import { AngularFireStorage } from '@angular/fire/storage';
import { base64StringToBlob } from 'blob-util';
import { Photo } from './photo.model';
import { Injectable } from '@angular/core';
import {
  Plugins, CameraResultType, FilesystemDirectory,
  CameraPhoto, CameraSource
} from '@capacitor/core';
import { finalize } from 'rxjs/operators'

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";

  capturedPhoto: string[] = [];

  rutas: string[] = [];

  index: number;

  //Dependencias.
  constructor(
    private AngularFireStorage: AngularFireStorage,
  ) {

  }

  //Tomamos una foto con la camara y la mandamos al metodo que las convierte en base64 
  //y lo agreamos al arreglo de Fotos.
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 50
    });


    //Las guardamis en memoria mientras estamos en la pagina de añadir departamento.
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    Storage.set({
      key: this.PHOTO_STORAGE + this.index,
      value: JSON.stringify(this.photos)
    });
  }
  
  //Tomamos una foto desde la galeria y sucede lo mismo que el metodo anterior.
  public async addNewFromGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      quality: 50
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);
    Storage.set({
      key: this.PHOTO_STORAGE + this.index,
      value: JSON.stringify(this.photos)
    });
  }

  //Metodo que sube las fotos al Firebase y devuelve las rutas.
  async foto() {
    await this.loadSaved();
    return this.rutas;
  }

  private async savePicture(cameraPhoto: CameraPhoto) {

    //Convertimos la foto a base64
    const base64Data = await this.readAsBase64(cameraPhoto);

    //Se guarda el archivo en el sistema con un nombre y una extension.
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    //Cargamos el webpath para mostrar las fotos en lugar de base64 que estan almacenadas en memoria.
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {

    //Leemos la foto como tipo Blob y lo convertimos a base64
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {

    //Cargamos el cache de la imagen a una variable que se tenian almacenadas localmente.
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE + this.index });
    this.photos = JSON.parse(photoList.value) || [];
    for (let photo of this.photos) {
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: FilesystemDirectory.Data
      });

      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;

      //Mandamos el base64 a el metodo para cargar las imagenes a Firebase y esperamos.
     await this.uploadImagesFirebase(photo.webviewPath);
    }
  }

  //Cargamos las imagenes a Firebase.
  uploadImagesFirebase(i: string): Promise<string> {

    //Convertimos el base64 a Blob para poder cargarlo a Firebase.
    return new Promise(resolve => {
      const contentType = 'image/jpeg';
      var b64Data = i;

      //Le quitamos caracteres inecesarios.
      var resultado = b64Data.replace('data:image/jpeg;base64,', '');

      //Lo convertimos.
      const blob = base64StringToBlob(resultado, contentType);

      //Le generamos un id a esa imagen.
      const id = Math.random().toString(36).substring(2);
      const file = blob;
      const filePath = `imagenes/departamentos/departamento_${id}`;
      const ref = this.AngularFireStorage.ref(filePath);

      //Lo cargamos finalmente a Firebase.
      const task = this.AngularFireStorage.upload(filePath, file);
      task.snapshotChanges().pipe(finalize(() => {
        ref.getDownloadURL().subscribe(res => {
          const downloadUrl = res;

          //Devuelve en enlace de la imagen y se lo agregamos al arreglo de los enlaces.
          resolve(downloadUrl);
          this.rutas.unshift(downloadUrl);
          return;
        })
      }))
        .subscribe();
    });
  }
}

