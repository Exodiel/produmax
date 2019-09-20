import { Request, Response } from "express";
import Product from "../models/Product";
import { resolve, extname } from "path";
import { unlink } from "fs-extra";
import Unit from "../models/Unit";
import Category from "../models/Category";

/**
 * @author Jipson Saad
 * 
 * Esta clase se encarga de ser el intermediario entre el modelo(Schema Mongoose) y la vista(App Flutter)
 * @class ProductController
 */
class ProductController {
  constructor() {
    // asignación de contexto
    this.getProducts = this.getProducts.bind(this);
    this.createProduct = this.createProduct.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.deleteProduct = this.deleteProduct.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
  }

  /**
   * Esta función se encarga de devolver todos los productos provenientes de la base de datos
   *
   * @async esta función es asíncrona
   * @function getProducts devuelve todos los productos
   * @param req variable de tipo Request(Petición HTTP)
   * @param res  variable de tipo Response(Respuesta HTTP)
   * @returns devuelve una respuesta HTTP
   */
  async getProducts(req: Request, res: Response): Promise<Response> {
    try {
      const products = await Product.find();
      return res.status(200).json({ products: products });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Existe un problema encontrando los productos" });
    }
  }

  /**
   * Esta función se encarga de devolver un sólo producto proveniente de la base de datos
   * Se obtiene un parámetro proveniente de la URI y se busca al producto específico
   *
   * @async esta función es asíncrona
   * @function getProduct devuelve un sólo producto
   * @param req variable de tipo Request(Petición HTTP)
   * @param res  variable de tipo Response(Respuesta HTTP)
   * @returns devuelve una respuesta HTTP
   */
  async getProduct(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // obtengo el identificador de la URI
    try {
      const product = await Product.findById(id); // busco el producto con su identificador

      if (!product) // en caso el producto no existe el servidor responde con 404
        return res.status(404).json({ message: "Producto no encontrado" });

      // el servidor responde con 200 si el producto existe  
      return res
        .status(200)
        .json({
          massage: "Producto encontrado satisfactoriamente",
          product: product
        });
    } catch (error) {
      // el servidor responde con 500 si existe un problema
      return res
        .status(500)
        .json({ message: "Existe un problema encontrando el producto" });
    }
  }

  /**
   * Esta función se encarga de crear un sólo producto en la base de datos
   * Se obtiene un cuerpo en formato JSON proveniente de la aplicación cliente(App Flutter) y,
   * comprueba que la extensión de la imagen sea png, jpg o jpeg, además multer comprueba que el
   * archivo sea máximo de 1mb
   *
   * @async esta función es asíncrona
   * @function createProduct crea un sólo producto
   * @param req variable de tipo Request(Petición HTTP)
   * @param res  variable de tipo Response(Respuesta HTTP)
   * @returns devuelve una respuesta HTTP
   */
  async createProduct(req: Request, res: Response): Promise<Response> {
    const {
      name,
      details,
      stock,
      unitPrice,
      unitName,
      categoryName
    } = req.body; // obtengo la información del cuerpo de la petición
    const { path, originalname } = req.file; // obtengo el path(ruta donde se guardará la imagen) y el nombre original antes de que se guarde la imagen
    const ext = extname(originalname).toLowerCase(); // obtengo la extensión de la imagen
    try {
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") { // compruebo que la extensión no sea de otro tipo
        const unit = await Unit.findOne({ name: unitName }); // obtengo el documento de la unidad mediante una búsqueda
        const category = await Category.findOne({ name: categoryName }); // hago lo mismo para la categoría
        const newProduct = {
          name: name,
          details: details,
          stock: stock,
          unitPrice: unitPrice,
          imagePath: path,
          unitId: unit ? unit._id : "", // guardo la referencia al documento de la unidad
          categoryId: category ? category._id : "" // hago lo mismo con la categoría
        };
        const product = new Product(newProduct); // creo un nuevo documento
        await product.save(); // persisto en la base de datos

        return res // el servidor responde con 201 cuando se crea el producto
          .status(201)
          .json({
            message: "Producto guardado satisfactoriamente",
            product: product
          });
      } else {
        await unlink(path);// se borra la imagen enviada de la carpeta temporal
        // el servidor responde con 400 si no es la extensión correcta
        return res.status(400).json({ message: "Producto no se ha guardado" });
      }
    } catch (error) {
      await unlink(path);
      return res
        .status(500)
        .json({ message: "Existe un problema guardando el producto" });
    }
  }

  /**
   * Esta función se encarga de eliminar un sólo producto
   *
   * @async esta función es asíncrona
   * @function updateProduct elimina un sólo producto
   * @param req variable de tipo Request(Petición HTTP)
   * @param res variable de tipo Response(Respuesta HTTP)
   * @returns devuelve una respuesta HTTP
   */
  async deleteProduct(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // obtengo el identificador de la URI
    try {
      const product = await Product.findById(id); // busco el producto

      if (!product) // compruebo la existencia del producto
        return res.status(404).json({ message: "Producto no encontrado" });
      if (!resolve(product.imagePath)) // compruebo la existencia de la imagen en el servidor
        return res
          .status(404)
          .json({ message: "No se ha encontrado la imagen" });

      await unlink(resolve(product.imagePath)); // elimino la imagen que se encuentra en el servidor
      await product.remove(); // elimino el producto de la base de datos
      return res
        .status(200)
        .json({ message: "Producto Eliminado satisfactoriamente" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Existe un problema eliminando el producto" });
    }
  }

  /**
   * Esta función se encarga de actualizar los datos de un producto
   *
   * @async esta función es asíncrona
   * @function updateProduct actualiza un sólo producto
   * @param req variable de tipo Request(Petición HTTP)
   * @param res variable de tipo Response(Respuesta HTTP)
   * @returns devuelve una respuesta HTTP
   */
  async updateProduct(req: Request, res: Response): Promise<Response> {
    const { id } = req.params; // obtengo el id de la URI
    const file = req.file; // obtengo el objeto que contiene al información de la imagen
    if (!file) return res.status(400).json({ message: "Sube una imagen" }); // compruebo que el objeto existe

    const ext = extname(file.originalname).toLowerCase(); // obtengo la extensión de la imagen
    const {
      name,
      details,
      stock,
      unitPrice,
      unitName,
      categoryName
    } = req.body; // obtengo el cuerpo de la petición enviada por la aplicación cliente
    try {
      if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") { // compruebo que la extensión no sea de otro tipo
        const unit = await Unit.findOne({ name: unitName }); // obtengo el documento de la unidad mediante una búsqueda
        const category = await Category.findOne({ name: categoryName }); // hago lo mismo para la categoría

        const updatedProduct = await Product.findById(id); // busco el producto que se actualizará
        if (!updatedProduct) { // compruebo que el producto existe
          await unlink(file.path); // elimino la imagen de la carpeta temporal
          return res
            .status(404)
            .json({ message: "El producto no se ha encontrado" }); // devuelvo un respuesta
        }
        const existPath = resolve(updatedProduct.imagePath); //compruebo que la ruta de la imagen existe antes de actualizar
        if (!existPath) // si no existe la ruta de la imagen en el servidor, el mismo responde con 404
          return res
            .status(404)
            .json({ message: "No se ha encontrado la imagen" });

        updatedProduct.name = name;
        updatedProduct.details = details;
        updatedProduct.stock = stock;
        updatedProduct.unitPrice = unitPrice;
        updatedProduct.imagePath = file.path
          ? file.path
          : updatedProduct.imagePath; // guardo la ruta con la seguridad de que existe el objeto file
        updatedProduct.unitId = unit ? unit._id : ""; // guardo la referencia al documento de la unidad
        updatedProduct.categoryId = category ? category._id : ""; // hago lo mismo con la categoría

        await unlink(existPath); // elimino la ruta de la imagen anterior
        await updatedProduct.save(); // persisto en la base de datos

        return res.status(200).json({
          message: "Producto actualizado correctamente",
          product: updatedProduct
        }); // el servidor responde correctamente
      } else {
        // si la extensión de la image es diferente, el servidor responde con 400
        await unlink(file.path); 
        return res.status(400).json({ message: "Producto no se ha guardado" });
      }
    } catch (error) {
      await unlink(file.path); // se elimina la imagen de la carpeta temporal
      // en caso de no enviar la información correctamente, el servidor responde con 500
      return res
        .status(500)
        .json({ massage: "Existe un problema actualizando el producto" });
    }
  }
}
const productController = new ProductController();
export default productController;
