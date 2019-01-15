export class User { 
    public nombre: string; 
    public email: string;
    public uid: string; 

    constructor( obj: DataObj ){ 
        this.nombre = obj && obj.nombre || null; // si existe obj, si existe tomael objet.nombre  mandar los valores de DataObj si no mandar a null        
        this.uid    = obj && obj.uid || null;
        this.email  = obj && obj.email || null;
    }

    // constructor(nombre: string, email: string, uid: string){ 
    //     this.nombre = nombre;
    //     this.uid =  uid;
    //     this.email =  email;
    // }
}

interface DataObj { 
    uid: string; 
    email: string;
    nombre: string
}