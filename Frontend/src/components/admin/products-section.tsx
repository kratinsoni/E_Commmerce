"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  productImage: string;
  price: number;
  stock: number;
  owner: string;
  createdAt: string;
}

const mockProducts: Product[] = [
  {
    _id: "p1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    productImage: "/wireless-headphones.png",
    price: 100,
    stock: 25,
    owner: "admin",
    createdAt: "2024-01-15",
  },
  {
    _id: "p2",
    name: "Phone Case",
    description: "Durable protective phone case",
    productImage: "/colorful-phone-case-display.png",
    price: 25,
    stock: 3,
    owner: "admin",
    createdAt: "2024-01-20",
  },
  {
    _id: "p3",
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    productImage: "/smartwatch-lifestyle.png",
    price: 200,
    stock: 15,
    owner: "admin",
    createdAt: "2024-02-01",
  },
  {
    _id: "p4",
    name: "USB Cable Pack",
    description: "Pack of 3 USB-C cables",
    productImage: "/usb-cables.jpg",
    price: 25,
    stock: 0,
    owner: "admin",
    createdAt: "2024-02-05",
  },
];

const emptyProduct = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFileSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddProduct = async () => {
    setProductForm(emptyProduct);
    setSelectedFile(null);
    setFilePreview(null);
    setIsAddDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    });
    setFilePreview(product.productImage);
    setSelectedFile(null);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveNewProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("price", productForm.price.toString());
      formData.append("stock", productForm.stock.toString());

      if (selectedFile) {
        formData.append("productImage", selectedFile); // KEY MUST MATCH backend
      }

      const response = await axios.post(`${BASE_URL}/products`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Product added:", response.data);
      toast.success("Product added successfully!");
      getAllProducts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    }

    setIsAddDialogOpen(false);
    clearFileSelection();
    setProductForm(emptyProduct);
  };

  const handleSaveEditProduct = async () => {
    if (!selectedProduct) return;
    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("price", productForm.price.toString());
      formData.append("stock", productForm.stock.toString());

      if (selectedFile) {
        formData.append("productImage", selectedFile); // KEY MUST MATCH backend
      }
      const response = await axios.patch(
        `${BASE_URL}/products/${selectedProduct._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product updated:", response.data);
      toast.success("Product updated successfully!");
      getAllProducts();
    } catch (error) {
      console.log("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    }
    setIsEditDialogOpen(false);
    clearFileSelection();
    setSelectedProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    console.log("Deleting product with ID:", selectedProduct._id);
    try {
      const response = await axios.delete(
        `${BASE_URL}/products/${selectedProduct._id}`,
        {
          withCredentials: true,
        }
      );
      console.log("Product deleted:", response.data);
      toast.success("Product deleted successfully!");
      getAllProducts();
    } catch (error) {
      console.log("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    }
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <Badge className="bg-red-100 text-red-700 border border-red-200">
          Out of Stock
        </Badge>
      );
    }
    if (stock <= 5) {
      return (
        <Badge className="bg-amber-100 text-amber-700 border border-amber-200">
          Low Stock ({stock})
        </Badge>
      );
    }
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
        In Stock ({stock})
      </Badge>
    );
  };

  const getAllProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`, {
        withCredentials: true,
      });
      console.log("Products fetched:", response.data);
      setProducts(response.data.data);
      toast.success("Products fetched successfully!");
    } catch (error) {
      console.log("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again.");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      <Card className="border-border shadow-sm transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Products</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-48 transition-all duration-200 focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button
                onClick={handleAddProduct}
                className="transition-all duration-150"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Description
                  </TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    className="transition-colors duration-150 hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                        <img
                          src={product.productImage || "/placeholder.svg"}
                          alt={product.name}
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                      {product.description}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ${product.price}
                    </TableCell>
                    <TableCell>{getStockBadge(product.stock)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="transition-all duration-150 hover:bg-accent"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product)}
                          className="transition-all duration-150 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the product details below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter product name"
                className="transition-all duration-200 focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter product description"
                className="resize-none transition-all duration-200 focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-4">
                {filePreview ? (
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={filePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="object-cover"
                    />
                    <button
                      onClick={clearFileSelection}
                      className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="transition-all duration-150"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveNewProduct}
              className="transition-all duration-150"
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm((prev) => ({ ...prev, name: e.target.value }))
                }
                className="transition-all duration-200 focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="resize-none transition-all duration-200 focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  min="0"
                  value={productForm.stock}
                  onChange={(e) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center gap-4">
                {filePreview ? (
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={filePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="object-cover"
                    />
                    <button
                      onClick={clearFileSelection}
                      className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="transition-all duration-150"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedFile ? selectedFile.name : "Upload a new image"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEditProduct}
              className="transition-all duration-150"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedProduct?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90 transition-all duration-150"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
