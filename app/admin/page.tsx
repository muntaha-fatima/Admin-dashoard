
// 'use client';

// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import {
//   Card, CardHeader, CardTitle, CardDescription, CardContent,
// } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { BookOpen, Plus, Library, Trash2 } from "lucide-react";

// type Book = {
//   _id?: string;
//   title: string;
//   author: string;
//   description: string;
//   imageUrl: string;
//   pdfUrl: string;
//   promoImageUrl?: string;
//   isFeatured: boolean;
// };

// export default function AdminDashboard() {
//   const [book, setBook] = useState<any>({
//     type: "book",
//     title: "",
//     author: "",
//     description: "",
//     imageUrl: "",
//     pdfUrl: "",
//     promoImageUrl: "",
//     isFeatured: false,
//   });

//   const [loading, setLoading] = useState(false);
//   const [books, setBooks] = useState<Book[]>([]);

//   const fetchBooks = async () => {
//     try {
//       const res = await fetch("/api/booklibrary");
//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Failed to fetch");
//       if (Array.isArray(data)) setBooks(data.reverse());
//       else toast.error("❌ Unexpected data format");
//     } catch (err) {
//       toast.error("⚠️ Error fetching books");
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     setBook({ ...book, [e.target.name]: e.target.value });
//   };

//   const handleDelete = async (id: string) => {
//     try {
//       await fetch(`/api/booklibrary?id=${id}`, {
//         method: "DELETE",
//       });
//       toast.success("Book deleted successfully");
//       fetchBooks();
//     } catch (error) {
//       toast.error("Something went wrong");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const isImageOnly = book.type === "image";

//     // Basic validation
//     if (isImageOnly && !book.promoImageUrl) {
//       toast.error("⚠️ Promo Image URL required for image type");
//       setLoading(false);
//       return;
//     }
//     if (!isImageOnly && (!book.title || !book.author || !book.imageUrl || !book.pdfUrl)) {
//       toast.error("⚠️ Please fill all required book fields");
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:3000/api/booklibrary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(book),
//       });

//       if (res.ok) {
//         toast.success("✅ Added successfully!");
//         setBook({
//           type: "book",
//           title: "",
//           author: "",
//           description: "",
//           imageUrl: "",
//           pdfUrl: "",
//           promoImageUrl: "",
//           isFeatured: false,
//         });
//         fetchBooks();
//       } else {
//         toast.error("❌ Failed to add");
//       }
//     } catch (err) {
//       toast.error("❌ Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white border-r p-6 space-y-6 shadow-sm">
//         <h2 className="text-xl font-bold flex items-center gap-2">
//           <Library className="w-5 h-5" /> Admin Panel
//         </h2>
//         <nav className="space-y-3">
//           <button className="flex items-center gap-2 text-white font-medium hover:text-black">
//             <Plus className="w-4 h-4" /> Add Book
//           </button>
//           <button className="flex items-center gap-2 text-white font-medium hover:text-black">
//             <BookOpen className="w-4 h-4" /> View Books
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-10 overflow-y-auto space-y-10">
//         <div>
//           <h1 className="text-3xl font-bold">📚 Manage Library</h1>
//           <p className="text-muted-foreground">Add and manage your digital books here.</p>
//         </div>

//         {/* Form Section */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Add New Book / Promo Image</CardTitle>
//             <CardDescription>Select type and enter related fields.</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Type Selector */}
//               <div className="col-span-full">
//                 <Label htmlFor="type">Select Type</Label>
//                 <select
//                   name="type"
//                   id="type"
//                   className="border rounded p-2 w-full"
//                   value={book.type}
//                   onChange={handleChange}
//                 >
//                   <option value="book">📖 Book</option>
//                   <option value="image">🖼️ Promo Image</option>
//                 </select>
//               </div>

//               {/* Show only if type === 'book' */}
//               {book.type === "book" && (
//                 <>
//                   <InputField name="title" label="Title" value={book.title} onChange={handleChange} required />
//                   <InputField name="author" label="Author" value={book.author} onChange={handleChange} required />
//                   <InputField name="description" label="Description" value={book.description} onChange={handleChange} />
//                   <InputField name="imageUrl" label="Image URL" value={book.imageUrl} onChange={handleChange} required />
//                   <InputField name="pdfUrl" label="PDF URL" value={book.pdfUrl} onChange={handleChange} required />
//                 </>
//               )}

//               {/* Always show for both types */}
//               <InputField name="promoImageUrl" label="Promo Image URL" value={book.promoImageUrl} onChange={handleChange} required={book.type === "image"} />

//               <div className="col-span-full">
//                 <Label htmlFor="isFeatured">Show on Home Page?</Label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="isFeatured"
//                     name="isFeatured"
//                     checked={book.isFeatured}
//                     onChange={(e) => setBook({ ...book, isFeatured: e.target.checked })}
//                   />
//                   <span className="text-sm text-gray-700">Yes, display on homepage</span>
//                 </div>
//               </div>

//               <div className="col-span-full">
//                 <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-2xl shadow-xl">
//                   {loading ? "Uploading..." : "Submit"}
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>

//         {/* Book List */}
//         <section className="space-y-4">
//           <h2 className="text-2xl font-bold">📖 All Entries</h2>
//           {books.length === 0 ? (
//             <p className="text-muted-foreground">No entries yet.</p>
//           ) : (
//             <div className="grid md:grid-cols-2 gap-4">
//               {books.map((b) => (
//                 <Card key={b._id} className="p-4">
//                   <div className="flex gap-4">
//                     {b.imageUrl && (
//                       <img
//                         src={b.imageUrl}
//                         alt={b.title}
//                         className="w-24 h-auto rounded-md border"
//                       />
//                     )}
//                     <div className="flex-1 space-y-1">
//                       <h3 className="font-semibold text-lg">{b.title}</h3>
//                       <p className="text-sm">👤 {b.author}</p>
//                       <p className="text-sm text-muted-foreground">{b.description}</p>
//                       {b.pdfUrl && (
//                         <a
//                           href={b.pdfUrl}
//                           target="_blank"
//                           className="text-blue-600 underline text-sm"
//                         >
//                           📄 View PDF
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                   <Button
//                     variant="destructive"
//                     onClick={() => b._id && handleDelete(b._id)}
//                   >
//                     Delete
//                   </Button>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// // 👇 Custom InputField component for reuse
// function InputField({ name, label, value, onChange, required = false }: {
//   name: string;
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   required?: boolean;
// }) {
//   return (
//     <div className="grid gap-1.5">
//       <Label htmlFor={name}>{label}</Label>
//       <Input
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         placeholder={`Enter ${label.toLowerCase()}`}
//       />
//     </div>
//   );
// }


// "use client"



// import type React from "react"

// import { useEffect, useState } from "react"
// import { toast } from "sonner"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import {
//   BookOpen,
//   Plus,
//   Library,
//   Trash2,
//   Upload,
//   Eye,
//   Star,
//   ImageIcon,
//   FileText,
//   Users,
//   Search,
//   Edit,
//   X,
//   Save,
// } from "lucide-react"

// type Book = {
//   _id?: string
//   title: string
//   author: string
//   description: string
//   imageUrl: string
//   pdfUrl: string
//   promoImageUrl?: string
//   isFeatured: boolean
//   contentType: "book" | "image" // Updated to contentType
// }

// export default function Dashboard() {
//   const [book, setBook] = useState<any>({
//     contentType: "book", // Default contentType
//     title: "",
//     author: "",
//     description: "",
//     imageUrl: "",
//     pdfUrl: "",
//     promoImageUrl: "",
//     isFeatured: false,
//   })

//   const [loading, setLoading] = useState(false)
//   const [books, setBooks] = useState<Book[]>([])
//   const [activeTab, setActiveTab] = useState<"add" | "view">("add")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [editingBook, setEditingBook] = useState<Book | null>(null)
//   const [isEditMode, setIsEditMode] = useState(false)

//   const fetchBooks = async () => {
//     try {
//       const res = await fetch("/api/booklibrary")
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.message || "Failed to fetch")
//       if (Array.isArray(data)) setBooks(data.reverse())
//       else toast.error("❌ Unexpected data format")
//     } catch (err) {
//       toast.error("⚠️ Error fetching books")
//       console.error(err)
//     }
//   }

//   useEffect(() => {
//     fetchBooks()
//   }, [])

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target

//     const updateState = (prevState: any) => {
//       if (name === "contentType") {
//         const newType = value as "book" | "image"
//         const newState = { ...prevState, contentType: newType }
//         // Clear irrelevant fields based on new type
//         if (newType === "image") {
//           newState.title = ""
//           newState.author = ""
//           newState.description = ""
//           newState.imageUrl = ""
//           newState.pdfUrl = ""
//         } else {
//           // newType === "book"
//           newState.promoImageUrl = ""
//         }
//         return newState
//       } else {
//         return { ...prevState, [name]: value }
//       }
//     }

//     if (isEditMode && editingBook) {
//       setEditingBook(updateState(editingBook))
//     } else {
//       setBook(updateState(book))
//     }
//   }

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target
//     if (isEditMode && editingBook) {
//       setEditingBook({ ...editingBook, [name]: checked })
//     } else {
//       setBook({ ...book, [name]: checked })
//     }
//   }

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this entry?")) return

//     try {
//       await fetch(`/api/booklibrary?id=${id}`, {
//         method: "DELETE",
//       })
//       toast.success("✅ Entry deleted successfully")
//       fetchBooks()
//     } catch (error) {
//       toast.error("❌ Something went wrong")
//     }
//   }

//   const handleEdit = (bookToEdit: Book) => {
//     setEditingBook(bookToEdit)
//     setIsEditMode(true)
//     setActiveTab("add")
//     toast.info("📝 Edit mode activated")
//   }

//   const handleCancelEdit = () => {
//     setEditingBook(null)
//     setIsEditMode(false)
//     setBook({
//       contentType: "book",
//       title: "",
//       author: "",
//       description: "",
//       imageUrl: "",
//       pdfUrl: "",
//       promoImageUrl: "",
//       isFeatured: false,
//     })
//     setActiveTab("view") // Go back to view tab after cancelling edit
//     toast.info("❌ Edit cancelled")
//   }

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!editingBook || !editingBook._id) return

//     setLoading(true)

//     // Basic validation for edit mode
//     if (editingBook.contentType === "image" && !editingBook.promoImageUrl) {
//       toast.error("⚠️ Promo Image URL required for image type")
//       setLoading(false)
//       return
//     }
//     if (
//       editingBook.contentType === "book" &&
//       (!editingBook.title || !editingBook.author || !editingBook.imageUrl || !editingBook.pdfUrl)
//     ) {
//       toast.error("⚠️ Please fill all required book fields")
//       setLoading(false)
//       return
//     }

//     try {
//       const res = await fetch(`/api/booklibrary?id=${editingBook._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editingBook),
//       })

//       if (res.ok) {
//         toast.success("✅ Entry updated successfully!")
//         handleCancelEdit()
//         fetchBooks()
//         setActiveTab("view")
//       } else {
//         toast.error("❌ Failed to update entry")
//       }
//     } catch (err) {
//       toast.error("❌ Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (isEditMode) {
//       return handleUpdate(e)
//     }

//     setLoading(true)
//     const isImageOnly = book.contentType === "image"

//     // Basic validation for add mode
//     if (isImageOnly && !book.promoImageUrl) {
//       toast.error("⚠️ Promo Image URL required for image type")
//       setLoading(false)
//       return
//     }

//     if (!isImageOnly && (!book.title || !book.author || !book.imageUrl || !book.pdfUrl)) {
//       toast.error("⚠️ Please fill all required book fields")
//       setLoading(false)
//       return
//     }

//     try {
//       const res = await fetch("http://localhost:3000/api/booklibrary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(book),
//       })

//       if (res.ok) {
//         toast.success("✅ Added successfully!")
//         setBook({
//           contentType: "book",
//           title: "",
//           author: "",
//           description: "",
//           imageUrl: "",
//           pdfUrl: "",
//           promoImageUrl: "",
//           isFeatured: false,
//         })
//         fetchBooks()
//         setActiveTab("view")
//       } else {
//         toast.error("❌ Failed to add")
//       }
//     } catch (err) {
//       toast.error("❌ Something went wrong")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const filteredBooks = books.filter(
//     (book) =>
//       (book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (book.contentType === "image" && book.promoImageUrl?.toLowerCase().includes(searchTerm.toLowerCase()))) ??
//       false,
//   )

//   const stats = {
//     total: books.length,
//     featured: books.filter((b) => b.isFeatured).length,
//     regular: books.filter((b) => !b.isFeatured).length,
//   }

//   const currentFormData = isEditMode ? editingBook : book

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
//       {/* Enhanced Sidebar */}
//       <aside className="w-72 bg-white shadow-xl border-r border-slate-200 flex flex-col">
//         <div className="p-6 border-b border-slate-200">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
//               <Library className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
//               <p className="text-sm text-slate-500">Book Management</p>
//             </div>
//           </div>

//           {/* Edit Mode Indicator */}
//           {isEditMode && (
//             <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-lg text-white mb-4 shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-orange-100 text-sm">Editing Mode</p>
//                   <p className="font-bold truncate text-lg">
//                     {editingBook?.contentType === "book" ? editingBook?.title : "Promo Image"}
//                   </p>
//                 </div>
//                 <Edit className="w-6 h-6 text-orange-200" />
//               </div>
//             </div>
//           )}

//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 gap-3 mb-6">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-blue-100 text-sm">Total Entries</p>
//                   <p className="text-2xl font-bold">{stats.total}</p>
//                 </div>
//                 <BookOpen className="w-8 h-8 text-blue-200 opacity-70" />
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-purple-100 text-sm">Featured</p>
//                   <p className="text-2xl font-bold">{stats.featured}</p>
//                 </div>
//                 <Star className="w-8 h-8 text-purple-200 opacity-70" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="p-6 space-y-2 flex-1">
//           <button
//             onClick={() => setActiveTab("add")}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//               activeTab === "add"
//                 ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
//                 : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             {isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
//             <span className="font-medium">{isEditMode ? "Edit Entry" : "Add New Entry"}</span>
//           </button>

//           <button
//             onClick={() => setActiveTab("view")}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//               activeTab === "view"
//                 ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
//                 : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             <Eye className="w-5 h-5" />
//             <span className="font-medium">View All Entries</span>
//           </button>

//           {isEditMode && (
//             <button
//               onClick={handleCancelEdit}
//               className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
//             >
//               <X className="w-5 h-5" />
//               <span className="font-medium">Cancel Edit</span>
//             </button>
//           )}
//         </nav>
//         <div className="p-6 border-t border-slate-200 text-sm text-slate-500">
//           <p>&copy; {new Date().getFullYear()} Book Library. All rights reserved.</p>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-y-auto">
//         {/* Header */}
//         <header className="bg-white shadow-sm border-b border-slate-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-800">
//                 {activeTab === "add" ? (isEditMode ? "✏️ Edit Entry" : "📚 Add New Content") : "📖 Library Management"}
//               </h1>
//               <p className="text-slate-600 mt-1">
//                 {activeTab === "add"
//                   ? isEditMode
//                     ? `Editing: ${editingBook?.contentType === "book" ? editingBook?.title : "Promo Image"}`
//                     : "Add books and promotional images to your library"
//                   : "Manage your digital book collection"}
//               </p>
//             </div>

//             {activeTab === "view" && (
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
//                   <Input
//                     placeholder="Search entries..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 w-64 border-slate-300 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </header>

//         <div className="p-6">
//           {activeTab === "add" ? (
//             /* Add/Edit Form Section */
//             <Card className="shadow-xl border-0 bg-white rounded-xl">
//               <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b rounded-t-xl p-6">
//                 <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
//                   {isEditMode ? <Edit className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
//                   {isEditMode ? "Edit Entry Details" : "Add New Book / Promo Image"}
//                 </CardTitle>
//                 <CardDescription className="text-slate-600">
//                   {isEditMode
//                     ? "Update the entry information below"
//                     : "Choose the content type and fill in the required information"}
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="p-8">
//                 <form onSubmit={handleSubmit} className="space-y-8">
//                   {/* Type Selector - Only show in add mode */}
//                   {!isEditMode && (
//                     <div className="space-y-2">
//                       <Label htmlFor="contentType" className="text-base font-semibold text-slate-700">
//                         Content Type
//                       </Label>
//                       <select
//                         name="contentType"
//                         id="contentType"
//                         className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700"
//                         value={book.contentType}
//                         onChange={handleChange}
//                       >
//                         <option value="book">📖 Complete Book</option>
//                         <option value="image">🖼️ Promotional Image Only</option>
//                       </select>
//                     </div>
//                   )}

//                   {/* Book Fields */}
//                   {(isEditMode && currentFormData?.contentType === "book") ||
//                   (!isEditMode && book.contentType === "book") ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <EnhancedInputField
//                         name="title"
//                         label="Book Title"
//                         value={currentFormData?.title || ""}
//                         onChange={handleChange}
//                         required
//                         icon={<BookOpen className="w-4 h-4 text-slate-500" />}
//                       />
//                       <EnhancedInputField
//                         name="author"
//                         label="Author Name"
//                         value={currentFormData?.author || ""}
//                         onChange={handleChange}
//                         required
//                         icon={<Users className="w-4 h-4 text-slate-500" />}
//                       />
//                       <div className="md:col-span-2">
//                         <EnhancedInputField
//                           name="description"
//                           label="Description"
//                           value={currentFormData?.description || ""}
//                           onChange={handleChange}
//                           icon={<FileText className="w-4 h-4 text-slate-500" />}
//                         />
//                       </div>
//                       <EnhancedInputField
//                         name="imageUrl"
//                         label="Cover Image URL"
//                         value={currentFormData?.imageUrl || ""}
//                         onChange={handleChange}
//                         required
//                         icon={<ImageIcon className="w-4 h-4 text-slate-500" />}
//                       />
//                       <EnhancedInputField
//                         name="pdfUrl"
//                         label="PDF File URL"
//                         value={currentFormData?.pdfUrl || ""}
//                         onChange={handleChange}
//                         required
//                         icon={<FileText className="w-4 h-4 text-slate-500" />}
//                       />
//                     </div>
//                   ) : null}

//                   {/* Promo Image Field */}
//                   {(isEditMode && currentFormData?.contentType === "image") ||
//                   (!isEditMode && book.contentType === "image") ? (
//                     <div className="space-y-2">
//                       <EnhancedInputField
//                         name="promoImageUrl"
//                         label="Promotional Image URL"
//                         value={currentFormData?.promoImageUrl || ""}
//                         onChange={handleChange}
//                         required
//                         icon={<ImageIcon className="w-4 h-4 text-slate-500" />}
//                       />
//                     </div>
//                   ) : null}

//                   {/* Featured Toggle */}
//                   <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
//                     <input
//                       type="checkbox"
//                       id="isFeatured"
//                       name="isFeatured"
//                       checked={currentFormData?.isFeatured || false}
//                       onChange={handleCheckboxChange}
//                       className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
//                     />
//                     <div>
//                       <Label htmlFor="isFeatured" className="font-medium text-slate-700 cursor-pointer">
//                         Display on Homepage
//                       </Label>
//                       <p className="text-sm text-slate-600">This content will be featured on the main page</p>
//                     </div>
//                   </div>

//                   {/* Submit Button */}
//                   <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                     <Button
//                       type="submit"
//                       disabled={loading}
//                       className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
//                     >
//                       {loading ? (
//                         <div className="flex items-center gap-2">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           {isEditMode ? "Updating..." : "Processing..."}
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           {isEditMode ? <Save className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
//                           {isEditMode ? "Update Entry" : "Add to Library"}
//                         </div>
//                       )}
//                     </Button>

//                     {isEditMode && (
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={handleCancelEdit}
//                         className="flex-1 px-8 py-3 text-lg rounded-xl border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold"
//                       >
//                         <X className="w-5 h-5 mr-2" />
//                         Cancel
//                       </Button>
//                     )}
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           ) : (
//             /* Books List Section */
//             <div className="space-y-6">
//               {filteredBooks.length === 0 ? (
//                 <Card className="p-12 text-center bg-white shadow-lg rounded-xl">
//                   <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-slate-600 mb-2">No Entries Found</h3>
//                   <p className="text-slate-500">
//                     {searchTerm
//                       ? "No entries match your search criteria."
//                       : "Start by adding your first entry to the library."}
//                   </p>
//                   {!searchTerm && (
//                     <Button
//                       onClick={() => setActiveTab("add")}
//                       className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl shadow-md"
//                     >
//                       <Plus className="w-4 h-4 mr-2" />
//                       Add First Entry
//                     </Button>
//                   )}
//                 </Card>
//               ) : (
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredBooks.map((b) => (
//                     <Card
//                       key={b._id}
//                       className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 bg-white border-0 rounded-xl"
//                     >
//                       <div className="relative">
//                         {/* Conditional Image Display */}
//                         {b.contentType === "image" && b.promoImageUrl ? (
//                           <div className="aspect-[3/4] overflow-hidden bg-slate-100">
//                             <img
//                               src={b.promoImageUrl || "/placeholder.svg"} // Use promoImageUrl for contentType 'image'
//                               alt="Promotional Image"
//                               className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
//                             />
//                           </div>
//                         ) : b.contentType === "book" && b.imageUrl ? (
//                           <div className="aspect-[3/4] overflow-hidden bg-slate-100">
//                             <img
//                               src={b.imageUrl || "/placeholder.svg"} // Use imageUrl for contentType 'book'
//                               alt={b.title}
//                               className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
//                             />
//                           </div>
//                         ) : (
//                           // Fallback for no image or invalid contentType
//                           <div className="aspect-[3/4] flex items-center justify-center bg-slate-100 text-slate-400">
//                             <ImageIcon className="w-12 h-12" />
//                           </div>
//                         )}

//                         {/* Type Badge */}
//                         {b.contentType === "image" && (
//                           <Badge className="absolute top-3 left-3 bg-blue-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
//                             <ImageIcon className="w-3 h-3 mr-1" />
//                             Promo
//                           </Badge>
//                         )}
//                         {b.isFeatured && (
//                           <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
//                             <Star className="w-3 h-3 mr-1" />
//                             Featured
//                           </Badge>
//                         )}
//                       </div>

//                       <div className="p-6 space-y-3">
//                         {/* Conditional Title/Author/Description */}
//                         {b.contentType === "book" ? (
//                           <>
//                             <div>
//                               <h3 className="font-bold text-xl text-slate-800 line-clamp-2">{b.title}</h3>
//                               <p className="text-slate-600 flex items-center gap-1 text-sm mt-1">
//                                 <Users className="w-4 h-4 text-slate-500" />
//                                 {b.author}
//                               </p>
//                             </div>
//                             {b.description && <p className="text-sm text-slate-500 line-clamp-3">{b.description}</p>}
//                           </>
//                         ) : (
//                           <div>
//                             <h3 className="font-bold text-xl text-slate-800 line-clamp-2">Promotional Image</h3>
//                             <p className="text-slate-600 flex items-center gap-1 text-sm mt-1">
//                               <ImageIcon className="w-4 h-4 text-slate-500" />
//                               {b.promoImageUrl ? new URL(b.promoImageUrl).pathname.split("/").pop() : "No URL"}
//                             </p>
//                           </div>
//                         )}

//                         <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
//                           {/* Conditional PDF Button */}
//                           {b.contentType === "book" && b.pdfUrl && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               asChild
//                               className="flex-1 bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
//                             >
//                               <a href={b.pdfUrl} target="_blank" rel="noopener noreferrer">
//                                 <FileText className="w-4 h-4 mr-1" />
//                                 PDF
//                               </a>
//                             </Button>
//                           )}

//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleEdit(b)}
//                             className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
//                           >
//                             <Edit className="w-4 h-4" />
//                           </Button>

//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => b._id && handleDelete(b._id)}
//                             className="bg-red-500 hover:bg-red-600"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   )
// }

// // Enhanced Input Field Component
// function EnhancedInputField({
//   name,
//   label,
//   value,
//   onChange,
//   required = false,
//   icon,
// }: {
//   name: string
//   label: string
//   value: string
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
//   required?: boolean
//   icon?: React.ReactNode
// }) {
//   return (
//     <div className="space-y-2">
//       <Label htmlFor={name} className="text-base font-semibold text-slate-700 flex items-center gap-2">
//         {icon}
//         {label}
//         {required && <span className="text-red-500">*</span>}
//       </Label>
//       <Input
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         placeholder={`Enter ${label.toLowerCase()}`}
//         className="border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all p-3 text-slate-800"
//       />
//     </div>
//   )
// }

// "use client";

// import { useState, useCallback, useEffect } from "react";
// import { toast } from "sonner";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Trash2, Edit, ImageIcon, BookOpen } from "lucide-react";

// // Interface for Books
// interface Book {
//   _id: string;
//   title: string;
//   author: string;
//   description: string;
//   imageUrl: string;
//   pdfUrl: string;
//   contentType: "book";
// }

// // Interface for Promos
// interface Promo {
//   _id: string;
//   title: string;
//   promoImageUrl: string;
//   isFeatured: boolean;
//   contentType: "image";
// }

// export default function AdminDashboard() {
//   // State for Books
//   const [books, setBooks] = useState<Book[]>([]);
//   const [bookForm, setBookForm] = useState({
//     title: "",
//     author: "",
//     description: "",
//     imageUrl: "",
//     pdfUrl: "",
//   });
//   const [editingBookId, setEditingBookId] = useState<string | null>(null);

//   // State for Promos
//   const [promos, setPromos] = useState<Promo[]>([]);
//   const [promoForm, setPromoForm] = useState({
//     title: "",
//     promoImageUrl: "",
//     isFeatured: false,
//   });
//   const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
//   const [promoImageFile, setPromoImageFile] = useState<File | null>(null);

//   // Fetch Books
//   const fetchBooks = useCallback(async () => {
//     try {
//       const res = await fetch("/api/booklibrary?");
//       if (!res.ok) throw new Error("Failed to fetch books");
//       const data = await res.json();
//       setBooks(data.filter((item: Book) => item.contentType === "book"));
//     } catch (err) {
//       toast.error("⚠️ Error fetching books");
//       console.error(err);
//     }
//   }, []);

//   // Fetch Promos
//   const fetchPromos = useCallback(async () => {
//     try {
//       const res = await fetch("/api/booklibrary?purpose=promo");
//       if (!res.ok) throw new Error("Failed to fetch promos");
//       const data = await res.json();
//       setPromos(data.filter((item: Promo) => item.contentType === "image"));
//     } catch (err) {
//       toast.error("⚠️ Error fetching promos");
//       console.error(err);
//     }
//   }, []);

//   useEffect(() => {
//   fetchBooks();
//   fetchPromos();
// }, [fetchBooks, fetchPromos]); // ✅

//   // Handle Book Form Submission
//   const handleBookSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!bookForm.title || !bookForm.author || !bookForm.imageUrl || !bookForm.pdfUrl) {
//       toast.error("⚠️ Please fill all required book fields");
//       return;
//     }
//     try {
//       const method = editingBookId ? "PUT" : "POST";
//       const url = editingBookId
//         ? `/api/booklibrary?_id=${editingBookId}`
//         : "/api/booklibrary";
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...bookForm, contentType: "book" }),
//       });
//       if (!res.ok) throw new Error("Failed to save book");
//       toast.success(editingBookId ? "✅ Book updated" : "✅ Book added");
//       setBookForm({ title: "", author: "", description: "", imageUrl: "", pdfUrl: "" });
//       setEditingBookId(null);
//       fetchBooks();
//     } catch (err) {
//       toast.error("⚠️ Error saving book");
//       console.error(err);
//     }
//   };

//   // Handle Promo Form Submission
//   const handlePromoSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!promoForm.title || (!promoForm.promoImageUrl && !promoImageFile)) {
//       toast.error("⚠️ Please provide a title and either an image file or URL");
//       return;
//     }
//   }
  
     

//   // Handle Book Deletion
//   const handleDeleteBook = async (id: string) => {
//     try {
//       const res = await fetch(`/api/booklibrary?_id=${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete book");
//       toast.success("✅ Book deleted");
//       fetchBooks();
//     } catch (err) {
//       toast.error("⚠️ Error deleting book");
//       console.error(err);
//     }
//   };
  
//   // Handle Promo Deletion
//   const handleDeletePromo = async (id: string) => {
//     try {
//       const res = await fetch(`/api/booklibrary?_id=${id}`, { method: "DELETE" });
//       if (!res.ok) throw new Error("Failed to delete promo");
//       toast.success("✅ Promo deleted");
//       fetchPromos();
//     } catch (err) {
//       toast.error("⚠️ Error deleting promo");
//       console.error(err);
//     }
//   };

//   // Handle Book Edit
//   const handleEditBook = (book: Book) => {
//     setBookForm({
//       title: book.title,
//       author: book.author,
//       description: book.description,
//       imageUrl: book.imageUrl,
//       pdfUrl: book.pdfUrl,
//     });
//     setEditingBookId(book._id);
//   };

//   // Handle Promo Edit
//   const handleEditPromo = (promo: Promo) => {
//     setPromoForm({
//       title: promo.title,
//       promoImageUrl: promo.promoImageUrl,
//       isFeatured: promo.isFeatured,
//     });
//     setEditingPromoId(promo._id);
//     setPromoImageFile(null);
//   };
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
//       <header className="mb-8">
//         <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
//         <p className="text-slate-600 mt-2">Manage books and promotional images for Noor-e-Kitab</p>
//       </header>

//       <Tabs defaultValue="books" className="w-full">
//         <TabsList className="grid w-full grid-cols-2 bg-white rounded-xl p-1">
//           <TabsTrigger value="books" className="rounded-lg py-2">
//             <BookOpen className="w-4 h-4 mr-2" />
//             Books
//           </TabsTrigger>
//           <TabsTrigger value="promos" className="rounded-lg py-2">
//             <ImageIcon className="w-4 h-4 mr-2" />
//             Promos
//           </TabsTrigger>
//         </TabsList>

//         {/* Books Tab */}
//         <TabsContent value="books">
//           <Card className="bg-white shadow-lg rounded-xl">
//             <CardHeader>
//               <CardTitle className="text-2xl font-semibold text-slate-700">
//                 {editingBookId ? "Edit Book" : "Add New Book"}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleBookSubmit} className="space-y-4">
//                 <div>
//                   <Label htmlFor="bookTitle">Book Title</Label>
//                   <Input
//                     id="bookTitle"
//                     value={bookForm.title}
//                     onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
//                     placeholder="Enter book title"
//                     className="rounded-lg"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="bookAuthor">Author</Label>
//                   <Input
//                     id="bookAuthor"
//                     value={bookForm.author}
//                     onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
//                     placeholder="Enter author name"
//                     className="rounded-lg"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="bookDescription">Description</Label>
//                   <Input
//                     id="bookDescription"
//                     value={bookForm.description}
//                     onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
//                     placeholder="Enter book description"
//                     className="rounded-lg"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="bookImageUrl">Book Cover URL</Label>
//                   <Input
//                     id="bookImageUrl"
//                     value={bookForm.imageUrl}
//                     onChange={(e) => setBookForm({ ...bookForm, imageUrl: e.target.value })}
//                     placeholder="Enter book cover URL"
//                     className="rounded-lg"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="bookPdfUrl">PDF URL</Label>
//                   <Input
//                     id="bookPdfUrl"
//                     value={bookForm.pdfUrl}
//                     onChange={(e) => setBookForm({ ...bookForm, pdfUrl: e.target.value })}
//                     placeholder="Enter PDF URL"
//                     className="rounded-lg"
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
//                   {editingBookId ? "Update Book" : "Add Book"}
//                 </Button>
//                 {editingBookId && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setBookForm({ title: "", author: "", description: "", imageUrl: "", pdfUrl: "" });
//                       setEditingBookId(null);
//                     }}
//                     className="ml-2 rounded-lg"
//                   >
//                     Cancel
//                   </Button>
//                 )}
//               </form>
//             </CardContent>
//           </Card>

//           <Card className="mt-6 bg-white shadow-lg rounded-xl">
//             <CardHeader>
//               <CardTitle className="text-2xl font-semibold text-slate-700">All Books</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {books.length === 0 ? (
//                 <p className="text-slate-500">No books available</p>
//               ) : (
//                 <ul className="space-y-4">
//                   {books.map((book) => (
//                     <li key={book._id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
//                       <div>
//                         <h3 className="font-bold text-slate-800">{book.title}</h3>
//                         <p className="text-sm text-slate-600">Author: {book.author}</p>
//                         <p className="text-sm text-slate-600">Cover: {book.imageUrl}</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleEditBook(book)}
//                           className="rounded-lg"
//                         >
//                           <Edit className="w-4 h-4 mr-1" />
//                           Edit
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleDeleteBook(book._id)}
//                           className="rounded-lg"
//                         >
//                           <Trash2 className="w-4 h-4 mr-1" />
//                           Delete
//                         </Button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Promos Tab */}
//         <TabsContent value="promos">
//           <Card className="bg-white shadow-lg rounded-xl">
//             <CardHeader>
//               <CardTitle className="text-2xl font-semibold text-slate-700">
//                 {editingPromoId ? "Edit Promotional Image" : "Add New Promotional Image"}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handlePromoSubmit} className="space-y-4">
//                 <div>
//                   <Label htmlFor="promoTitle">Promo Title</Label>
//                   <Input
//                     id="promoTitle"
//                     value={promoForm.title}
//                     onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
//                     placeholder="Enter promo title"
//                     className="rounded-lg"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="promoImageFile">Upload Image</Label>
//                   <Input
//                     id="promoImageFile"
//                     type="file"
//                     accept="image/*"
//                     onChange={(e) => setPromoImageFile(e.target.files?.[0] || null)}
//                     className="rounded-lg"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="promoImageUrl">Or Enter Image URL</Label>
//                   <Input
//                     id="promoImageUrl"
//                     value={promoForm.promoImageUrl}
//                     onChange={(e) => setPromoForm({ ...promoForm, promoImageUrl: e.target.value })}
//                     placeholder="Enter promo image URL"
//                     className="rounded-lg"
//                   />
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="isFeatured"
//                     checked={promoForm.isFeatured}
//                     onCheckedChange={(checked) => setPromoForm({ ...promoForm, isFeatured: !!checked })}
//                   />
//                   <Label htmlFor="isFeatured">Display on Homepage</Label>
//                 </div>
//                 <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
//                   {editingPromoId ? "Update Promo" : "Add Promo"}
//                 </Button>
//                 {editingPromoId && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setPromoForm({ title: "", promoImageUrl: "", isFeatured: false });
//                       setPromoImageFile(null);
//                       setEditingPromoId(null);
//                     }}
//                     className="ml-2 rounded-lg"
//                   >
//                     Cancel
//                   </Button>
//                 )}
//               </form>
//             </CardContent>
//           </Card>

//           <Card className="mt-6 bg-white shadow-lg rounded-xl">
//             <CardHeader>
//               <CardTitle className="text-2xl font-semibold text-slate-700">All Promotional Images</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {promos.length === 0 ? (
//                 <p className="text-slate-500">No promotional images available</p>
//               ) : (
//                 <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                   {promos.map((promo) => (
//                     <li key={promo._id} className="p-4 bg-slate-50 rounded-lg">
//                       <div className="relative aspect-[3/4] mb-2">
//                         <img
//                           src={promo.promoImageUrl}
//                           alt={promo.title}
//                           className="w-full h-full object-cover rounded-lg"
//                           onError={() => toast.error(`⚠️ Failed to load image for ${promo.title}`)}
//                         />
//                         {promo.isFeatured && (
//                           <span className="absolute top-2 right-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full">
//                             Featured
//                           </span>
//                         )}
//                       </div>
//                       <h3 className="font-bold text-slate-800">{promo.title}</h3>
//                       <p className="text-sm text-slate-600 truncate">{promo.promoImageUrl}</p>
//                       <div className="flex gap-2 mt-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => handleEditPromo(promo)}
//                           className="rounded-lg"
//                         >
//                           <Edit className="w-4 h-4 mr-1" />
//                           Edit
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => handleDeletePromo(promo._id)}
//                           className="rounded-lg"
//                         >
//                           <Trash2 className="w-4 h-4 mr-1" />
//                           Delete
//                         </Button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
//   }


// src/app/admin/dashboard/page.tsx


// "use client";

// import React, { useState, useEffect, ChangeEvent, FormEvent, JSX } from "react";
// import { toast } from "sonner";
// import { Library, BookOpen, ImageIcon, Edit, Trash2, X, Plus, Users, FileText, Upload, Star, Search, Save, Eye } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// interface Book {
//   _id?: string;
//   title: string;
//   author: string;
//   description: string;
//   imageUrl: string;
//   pdfUrl: string;
//   isFeatured: boolean;
//   contentType: "book";
// }

// interface Promo {
//   _id?: string;
//   promoImageUrl: string;
//   isActive: boolean;
//   title: string;
//   contentType: "image";
// }

// type Content = Book | Promo;

// const initialBookState: Book = {
//   title: "",
//   author: "",
//   description: "",
//   imageUrl: "",
//   pdfUrl: "",
//   isFeatured: false,
//   contentType: "book",
// };

// const initialPromoState: Promo = {
//   promoImageUrl: "",
//   isActive: true,
//   title: "",
//   contentType: "image",
// };

// // Custom Input Field Component
// const EnhancedInputField = ({
//   label,
//   name,
//   value,
//   onChange,
//   required,
//   icon,
// }: {
//   label: string;
//   name: string;
//   value: string;
//   onChange: (e: ChangeEvent<HTMLInputElement>) => void;
//   required?: boolean;
//   icon: JSX.Element;
// }) => (
//   <div className="space-y-2">
//     <Label htmlFor={name} className="text-base font-semibold text-slate-700">
//       {label}
//     </Label>
//     <div className="relative">
//       <Input
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         className="pl-10 border-slate-300 focus:ring-blue-500 focus:border-transparent transition-all"
//       />
//       <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
//         {icon}
//       </div>
//     </div>
//   </div>
// );

// export default function AdminDashboard() {
//   const [allContent, setAllContent] = useState<Content[]>([]);
//   const [formData, setFormData] = useState<Content>(initialBookState);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("add");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const isBook = (content: Content): content is Book => {
//     return content.contentType === "book";
//   };

//   const isPromo = (content: Content): content is Promo => {
//     return content.contentType === "image";
//   };

//   const fetchContents = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const booksRes = await fetch("/api/booklibrary", { cache: "no-store" });
//       const booksData = await booksRes.json();
//       const books = booksData.data || [];

//       const promosRes = await fetch("/api/promos", { cache: "no-store" });
//       const promosData = await promosRes.json();
//       const promos = promosData.data || [];

//       const combinedContent = [...books, ...promos];
//       setAllContent(combinedContent);

//     } catch (error) {
//       console.error("Failed to fetch content:", error);
//       setError("Failed to load content. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContents();
//   }, []);

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const newContentType = e.target.value as "book" | "image";
//     setFormData(newContentType === "book" ? initialBookState : initialPromoState);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     const method = isEditMode ? "PUT" : "POST";
//     const endpoint = isBook(formData)
//       ? `/api/booklibrary${isEditMode ? `?id=${formData._id}` : ''}`
//       : `/api/promos${isEditMode ? `?id=${formData._id}` : ''}`;

//     let payload: Partial<Book> | Partial<Promo>;

//     if (isBook(formData)) {
//       payload = {
//         title: formData.title,
//         author: formData.author,
//         description: formData.description,
//         imageUrl: formData.imageUrl,
//         pdfUrl: formData.pdfUrl,
//         isFeatured: formData.isFeatured,
//         contentType: "book",
//       };

//       if (!payload.title || !payload.author || !payload.imageUrl || !payload.pdfUrl) {
//         toast.error("⚠️ All book fields are required.");
//         setLoading(false);
//         return;
//       }
//     } else {
//       payload = {
//         promoImageUrl: formData.promoImageUrl,
//         isActive: formData.isActive,
//         title: formData.title,
//         contentType: "image",
//       };

//       if (!payload.promoImageUrl) {
//         toast.error("⚠️ Promotional image URL is required.");
//         setLoading(false);
//         return;
//       }
//     }

//     try {
//       const res = await fetch(endpoint, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(
//           errorData.message || `Failed to ${isEditMode ? "update" : "add"} content.`
//         );
//       }

//       toast.success(`✅ Content ${isEditMode ? "updated" : "added"} successfully.`);
//       fetchContents();
//       handleCancelEdit();
//     } catch (err) {
//       if (err instanceof Error) {
//         toast.error(`❌ Failed to save content: ${err.message}`);
//         console.error("Submit error:", err);
//       } else {
//         toast.error("❌ An unknown error occurred.");
//         console.error("Submit error:", err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (item: Content) => {
//     setFormData(item);
//     setIsEditMode(true);
//     setActiveTab("add");
//   };

//   const handleDelete = async (id: string, contentType: "book" | "image") => {
//     const isConfirmed = window.confirm("Are you sure you want to delete this content?");
//     if (!isConfirmed) return;

//     try {
//       // ✅ Corrected API endpoint based on content type
//       const res = await fetch(`/api/${contentType === "book" ? "booklibrary" : "promos"}?id=${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "Failed to delete content.");
//       }

//       toast.success("✅ Content deleted successfully.");
//       fetchContents();
//     } catch (err) {
//       if (err instanceof Error) {
//         toast.error(`❌ Failed to delete content: ${err.message}`);
//         console.error("Delete error:", err);
//       } else {
//         toast.error("❌ An unknown error occurred.");
//         console.error("Delete error:", err);
//       }
//     }
//   };

//   const handleCancelEdit = () => {
//     setFormData(initialBookState);
//     setIsEditMode(false);
//   };
  
//   const filteredContents = allContent.filter(c => {
//     let searchString = "";
//     if (isBook(c)) {
//       searchString = `${c.title} ${c.author}`.toLowerCase();
//     } else if (isPromo(c)) {
//       searchString = c.title?.toLowerCase() || "";
//     }
//     return searchString.includes(searchTerm.toLowerCase());
//   });

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
//       <aside className="w-72 bg-white shadow-xl border-r border-slate-200 flex flex-col">
//         <div className="p-6 border-b border-slate-200">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
//               <Library className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
//               <p className="text-sm text-slate-500">Books & Promo Management</p>
//             </div>
//           </div>
//           {isEditMode && (
//             <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-lg text-white mb-4 shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-orange-100 text-sm">Editing Mode</p>
//                   <p className="font-bold truncate text-lg">
//                     {isBook(formData) ? formData.title : formData.title || "Untitled"}
//                   </p>
//                 </div>
//                 <Edit className="w-6 h-6 text-orange-200" />
//               </div>
//             </div>
//           )}
//           <div className="grid grid-cols-1 gap-3 mb-6">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-blue-100 text-sm">Total Entries</p>
//                   <p className="text-2xl font-bold">{allContent.length}</p>
//                 </div>
//                 <BookOpen className="w-8 h-8 text-blue-200 opacity-70" />
//               </div>
//             </div>
//             <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-purple-100 text-sm">Books</p>
//                   <p className="text-2xl font-bold">{allContent.filter(c => c.contentType === "book").length}</p>
//                 </div>
//                 <BookOpen className="w-8 h-8 text-purple-200 opacity-70" />
//               </div>
//             </div>
//             <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-green-100 text-sm">Promo Images</p>
//                   <p className="text-2xl font-bold">{allContent.filter(c => c.contentType === "image").length}</p>
//                 </div>
//                 <ImageIcon className="w-8 h-8 text-green-200 opacity-70" />
//               </div>
//             </div>
//             <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-lg text-white shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-yellow-100 text-sm">Featured</p>
//                   <p className="text-2xl font-bold">{allContent.filter(c => isBook(c) && c.isFeatured).length}</p>
//                 </div>
//                 <Star className="w-8 h-8 text-yellow-200 opacity-70" />
//               </div>
//             </div>
//           </div>
//         </div>
//         <nav className="p-6 space-y-2 flex-1">
//           <button
//             onClick={() => { setActiveTab("add"); handleCancelEdit(); }}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//               activeTab === "add" ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             {isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
//             <span className="font-medium">{isEditMode ? "Edit Content" : "Add New Content"}</span>
//           </button>
//           <button
//             onClick={() => setActiveTab("view")}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
//               activeTab === "view" ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : "text-slate-600 hover:bg-slate-100"
//             }`}
//           >
//             <Eye className="w-5 h-5" />
//             <span className="font-medium">View All Content</span>
//           </button>
//           {isEditMode && (
//             <button
//               onClick={handleCancelEdit}
//               className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
//             >
//               <X className="w-5 h-5" />
//               <span className="font-medium">Cancel Edit</span>
//             </button>
//           )}
//         </nav>
//         <div className="p-6 border-t border-slate-200 text-sm text-slate-500">
//           <p>&copy; {new Date().getFullYear()} Book Library. All rights reserved.</p>
//         </div>
//       </aside>
//       <main className="flex-1 overflow-y-auto">
//         <header className="bg-white shadow-sm border-b border-slate-200 p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-800">
//                 {activeTab === "add" ? (isEditMode ? "✏️ Edit Content" : "📚 Add New Content") : "📖 Content Management"}
//               </h1>
//               <p className="text-slate-600 mt-1">
//                 {activeTab === "add"
//                   ? isEditMode
//                     ? `Editing: ${isBook(formData) ? formData.title : formData.title || "Untitled"}`
//                     : "Add books or promotional images to your library"
//                   : "Manage your books and promotional images"}
//               </p>
//             </div>
//             {activeTab === "view" && (
//               <div className="flex items-center gap-4">
//                 <div className="relative">
//                   <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
//                   <Input
//                     placeholder="Search content..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 w-64 border-slate-300 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </header>
//         <div className="p-6">
//           {activeTab === "add" ? (
//             <Card className="shadow-xl border-0 bg-white rounded-xl">
//               <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b rounded-t-xl p-6">
//                 <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
//                   {isEditMode ? <Edit className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
//                   {isEditMode ? "Edit Content Details" : "Add New Content"}
//                 </CardTitle>
//                 <CardDescription className="text-slate-600">
//                   {isEditMode ? "Update the content information below" : "Fill in the required information for the book or promotional image"}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-8">
//                 <form onSubmit={handleSubmit} className="space-y-8">
//                   <div className="space-y-2">
//                     <Label htmlFor="contentType" className="text-base font-semibold text-slate-700">
//                       Content Type
//                     </Label>
//                     <select
//                       name="contentType"
//                       id="contentType"
//                       className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700"
//                       value={formData.contentType}
//                       onChange={handleContentTypeChange}
//                       disabled={isEditMode}
//                     >
//                       <option value="book">📖 Book</option>
//                       <option value="image">🖼️ Promotional Image</option>
//                     </select>
//                   </div>
//                   {isBook(formData) ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <EnhancedInputField
//                         name="title"
//                         label="Book Title"
//                         value={formData.title}
//                         onChange={handleInputChange}
//                         required
//                         icon={<BookOpen className="w-4 h-4 text-slate-500" />}
//                       />
//                       <EnhancedInputField
//                         name="author"
//                         label="Author Name"
//                         value={formData.author}
//                         onChange={handleInputChange}
//                         required
//                         icon={<Users className="w-4 h-4 text-slate-500" />}
//                       />
//                       <div className="md:col-span-2">
//                         <div className="space-y-2 relative">
//                           <Label htmlFor="description" className="text-base font-semibold text-slate-700">Description</Label>
//                           <textarea
//                             id="description"
//                             name="description"
//                             value={formData.description}
//                             onChange={handleInputChange}
//                             required
//                             className="w-full border border-slate-300 rounded-lg p-3 pl-10 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 min-h-[100px]"
//                           />
//                           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 mt-3"><FileText className="w-4 h-4 text-slate-500" /></div>
//                         </div>
//                       </div>
//                       <EnhancedInputField
//                         name="imageUrl"
//                         label="Cover Image URL"
//                         value={formData.imageUrl}
//                         onChange={handleInputChange}
//                         required
//                         icon={<ImageIcon className="w-4 h-4 text-slate-500" />}
//                       />
//                       <EnhancedInputField
//                         name="pdfUrl"
//                         label="PDF File URL"
//                         value={formData.pdfUrl}
//                         onChange={handleInputChange}
//                         required
//                         icon={<FileText className="w-4 h-4 text-slate-500" />}
//                       />
//                     </div>
//                   ) : (
//                     <div className="space-y-6">
//                       <EnhancedInputField
//                         name="title"
//                         label="Promo Title"
//                         value={formData.title || ""}
//                         onChange={handleInputChange}
//                         icon={<BookOpen className="w-4 h-4 text-slate-500" />}
//                       />
//                       <EnhancedInputField
//                         name="promoImageUrl"
//                         label="Promotional Image URL"
//                         value={formData.promoImageUrl}
//                         onChange={handleInputChange}
//                         required
//                         icon={<ImageIcon className="w-4 h-4 text-slate-500" />}
//                       />
//                     </div>
//                   )}
//                   <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
//                     <input
//                       type="checkbox"
//                       id="isFeatured"
//                       name={isBook(formData) ? "isFeatured" : "isActive"}
//                       checked={isBook(formData) ? formData.isFeatured : formData.isActive}
//                       onChange={handleCheckboxChange}
//                       className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
//                     />
//                     <div>
//                       <Label htmlFor="isFeatured" className="font-medium text-slate-700 cursor-pointer">
//                         {isBook(formData) ? "Is Featured" : "Is Active"}
//                       </Label>
//                       <p className="text-sm text-slate-600">
//                         This {formData.contentType === "book" ? "book" : "promo image"} will be featured on the main page.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                     <Button
//                       type="submit"
//                       disabled={loading}
//                       className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
//                     >
//                       {loading ? (
//                         <div className="flex items-center gap-2">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           {isEditMode ? "Updating..." : "Processing..."}
//                         </div>
//                       ) : (
//                         <div className="flex items-center gap-2">
//                           {isEditMode ? <Save className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
//                           {isEditMode ? "Update Content" : "Add Content"}
//                         </div>
//                       )}
//                     </Button>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={handleCancelEdit}
//                       className="flex-1 px-8 py-3 text-lg rounded-xl border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold"
//                     >
//                       <X className="w-5 h-5 mr-2" />
//                       Cancel
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="space-y-6">
//               {error ? (
//                 <Card className="p-12 text-center bg-white shadow-lg rounded-xl">
//                   <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-slate-600 mb-2">Error</h3>
//                   <p className="text-red-500">{error}</p>
//                 </Card>
//               ) : loading ? (
//                  <div className="flex items-center justify-center py-20">
//                   <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                  </div>
//               ) : filteredContents.length === 0 ? (
//                 <Card className="p-12 text-center bg-white shadow-lg rounded-xl">
//                   <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-slate-600 mb-2">No Content Found</h3>
//                   <p className="text-slate-500">
//                     {searchTerm
//                       ? "No content matches your search criteria."
//                       : "Start by adding your first book or promo image to the library."}
//                   </p>
//                   {!searchTerm && (
//                     <Button
//                       onClick={() => setActiveTab("add")}
//                       className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl shadow-md"
//                     >
//                       <Plus className="w-4 h-4 mr-2" />
//                       Add First Content
//                     </Button>
//                   )}
//                 </Card>
//               ) : (
//                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredContents.map((c: Content) => (
//                     <Card
//                       key={c._id}
//                       className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 bg-white border-0 rounded-xl"
//                     >
//                       <div className="relative">
//                         {isPromo(c) && c.promoImageUrl ? (
//                           <div className="aspect-[3/4] overflow-hidden bg-slate-100">
//                             <img
//                               src={c.promoImageUrl}
//                               alt={c.title || "Promotional Image"}
//                               className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
//                               onError={(e) => {
//                                 e.currentTarget.src = "/placeholder.svg?height=300&width=225";
//                                 toast.error(`⚠️ Failed to load image for promo: ${c.title || "Untitled"}`);
//                               }}
//                             />
//                           </div>
//                         ) : isBook(c) && c.imageUrl ? (
//                           <div className="aspect-[3/4] overflow-hidden bg-slate-100">
//                             <img
//                               src={c.imageUrl}
//                               alt={c.title}
//                               className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
//                               onError={(e) => {
//                                 e.currentTarget.src = "/placeholder.svg?height=300&width=225";
//                                 toast.error(`⚠️ Failed to load image for book: ${c.title}`);
//                               }}
//                             />
//                           </div>
//                         ) : (
//                           <div className="aspect-[3/4] flex items-center justify-center bg-slate-100 text-slate-400">
//                             <ImageIcon className="w-12 h-12" />
//                           </div>
//                         )}
//                         <Badge className="absolute top-3 left-3 bg-blue-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
//                           <ImageIcon className="w-3 h-3 mr-1" />
//                           {c.contentType === "book" ? "Book" : "Promo"}
//                         </Badge>
//                         {(isBook(c) && c.isFeatured) || (isPromo(c) && c.isActive) ? (
//                           <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm px-3 py-1 rounded-full shadow-md">
//                             <Star className="w-3 h-3 mr-1" />
//                             Featured
//                           </Badge>
//                         ) : null}
//                       </div>
//                       <div className="p-6 space-y-3">
//                         {isBook(c) ? (
//                           <>
//                             <div>
//                               <h3 className="font-bold text-xl text-slate-800 line-clamp-2">{c.title}</h3>
//                               <p className="text-sm text-slate-500 mt-1">by {c.author}</p>
//                             </div>
//                             <p className="text-slate-600 text-sm line-clamp-3">{c.description}</p>
//                           </>
//                         ) : (
//                           <>
//                             <div>
//                               <h3 className="font-bold text-xl text-slate-800 line-clamp-2">{c.title || "Promotional Image"}</h3>
//                               <p className="text-sm text-slate-500 mt-1">Status: {c.isActive ? "Active" : "Inactive"}</p>
//                             </div>
//                           </>
//                         )}
//                         <div className="flex gap-2 pt-2">
//                           <Button
//                             onClick={() => handleEdit(c)}
//                             className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md"
//                           >
//                             <Edit className="w-4 h-4 mr-2" /> Edit
//                           </Button>
//                           <Button
//                             onClick={() => handleDelete(c._id!, c.contentType)}
//                             className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md"
//                           >
//                             <Trash2 className="w-4 h-4 mr-2" /> Delete
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }











// src/app/admin/dashboard/page.tsx


"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent, JSX } from "react";
import { toast } from "sonner";
import {
  Library, BookOpen, ImageIcon, Edit, Trash2, X, Plus, Users,
  FileText, Upload, Star, Search, Save, Eye,  AlertTriangle
} from "lucide-react";

import { SignedIn, UserButton } from "@clerk/nextjs";


// Define your types here
interface Book {
  _id?: string;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
  pdfUrl: string;
  isFeatured: boolean;
  contentType: "book";
}

interface Promo {
  _id?: string;
  promoImageUrl: string;
  isActive: boolean;
  title: string;
  contentType: "image";
}

export type Content = Book | Promo;

const initialBookState: Book = {
  title: "",
  author: "",
  description: "",
  imageUrl: "",
  pdfUrl: "",
  isFeatured: false,
  contentType: "book",
};

const initialPromoState: Promo = {
  promoImageUrl: "",
  isActive: true,
  title: "",
  contentType: "image",
};

// Custom Input Field Component
const EnhancedInputField = ({
  label,
  name,
  value,
  onChange,
  required,
  icon,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon: JSX.Element;
  type?: string;
}) => (
  <div className="space-y-2">
    <label htmlFor={name} className="text-base font-semibold text-slate-700 block">
      {label}
    </label>
    <div className="relative">
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        type={type}
        className="pl-10 pr-3 py-2 w-full border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
        {icon}
      </div>
    </div>
  </div>
);

// Custom Modal Component
const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl p-6 transform transition-transform duration-300 scale-95 animate-slide-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [allContent, setAllContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  const isBook = (content: Content): content is Book => content.contentType === "book";
  const isPromo = (content: Content): content is Promo => content.contentType === "image";

  const fetchContents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [booksRes, promosRes] = await Promise.all([
        fetch("/api/booklibrary", { cache: "no-store" }),
        fetch("/api/promos", { cache: "no-store" }),
      ]);

      const [booksData, promosData] = await Promise.all([
        booksRes.json(),
        promosRes.json(),
      ]);

      const books = booksData.data || [];
      const promos = promosData.data || [];
      const combinedContent = [...books, ...promos];
      setAllContent(combinedContent);

    } catch (error) {
      console.error("Failed to fetch content:", error);
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingContent((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditingContent((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: checked };
    });
  };

  const handleContentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newContentType = e.target.value as "book" | "image";
    setEditingContent(newContentType === "book" ? initialBookState : initialPromoState);
  };

  const handleOpenModal = (content?: Content) => {
    setEditingContent(content || initialBookState);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContent(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;

    setLoading(true);

    const method = editingContent._id ? "PUT" : "POST";
    const endpoint = isBook(editingContent)
      ? `/api/booklibrary${editingContent._id ? `?id=${editingContent._id}` : ''}`
      : `/api/promos${editingContent._id ? `?id=${editingContent._id}` : ''}`;

    let payload: Partial<Content> = { ...editingContent };
    delete payload._id;

    if (isBook(editingContent)) {
      if (!editingContent.title || !editingContent.author || !editingContent.imageUrl || !editingContent.pdfUrl) {
        toast.error("⚠️ All book fields are required.");
        setLoading(false);
        return;
      }
    } else {
      if (!editingContent.promoImageUrl) {
        toast.error("⚠️ Promotional image URL is required.");
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${editingContent._id ? "update" : "add"} content.`);
      }

      toast.success(`✅ Content ${editingContent._id ? "updated" : "added"} successfully.`);
      fetchContents();
      handleCloseModal();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`❌ Failed to save content: ${err.message}`);
        console.error("Submit error:", err);
      } else {
        toast.error("❌ An unknown error occurred.");
        console.error("Submit error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, contentType: "book" | "image") => {
    const isConfirmed = window.confirm("Are you sure you want to delete this content?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/${contentType === "book" ? "booklibrary" : "promos"}?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete content.");
      }

      toast.success("✅ Content deleted successfully.");
      fetchContents();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`❌ Failed to delete content: ${err.message}`);
        console.error("Delete error:", err);
      } else {
        toast.error("❌ An unknown error occurred.");
        console.error("Delete error:", err);
      }
    }
  };
  
  const filteredContents = allContent.filter(c => {
    const searchString = isBook(c)
      ? `${c.title} ${c.author}`
      : c.title || "";
    return searchString.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const bookCount = allContent.filter(isBook).length;
  const promoCount = allContent.filter(isPromo).length;
  const totalFeatured = allContent.filter(c => (isBook(c) && c.isFeatured) || (isPromo(c) && c.isActive)).length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans text-slate-800">
      <aside className="w-72 bg-white shadow-xl border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md">
              <Library className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Admin Panel</h2>
              <p className="text-sm text-slate-500">Content Management</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white shadow-md transition-all hover:scale-[1.02] cursor-pointer" onClick={() => handleOpenModal()}>
              <div className="flex items-center justify-between">
               
                <div className="text-sm text-blue-100 font-normal">Add New Content</div>
                
                <Plus className="w-8 h-8 text-blue-200 opacity-70" />
              </div>
              <h3 className="text-2xl font-bold mt-2">Add Content</h3>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-purple-100 font-normal">Total Books</div>
                <BookOpen className="w-8 h-8 text-purple-200 opacity-70" />
              </div>
              <h3 className="text-2xl font-bold mt-2">{bookCount}</h3>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-lg text-white shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-green-100 font-normal">Total Promos</div>
                <ImageIcon className="w-8 h-8 text-green-200 opacity-70" />
              </div>
              <h3 className="text-2xl font-bold mt-2">{promoCount}</h3>
            </div>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-4 rounded-lg text-white shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="text-sm text-yellow-100 font-normal">Featured</div>
                <Star className="w-8 h-8 text-yellow-200 opacity-70" />
              </div>
              <h3 className="text-2xl font-bold mt-2">{totalFeatured}</h3>
            </div>
          </div>
        </div>
        <nav className="p-6 space-y-2 flex-1">
          <button
            onClick={() => {}}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 justify-start bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
          >
            <Eye className="w-5 h-5" />
            <span className="font-medium">View All Content</span>
          </button>
        </nav>
        <div className="p-6 border-t border-slate-200 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Book Library. All rights reserved.</p>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-4">
           

            <h1 className="text-3xl font-bold text-slate-800">
               
              Content Management
            </h1>
            <span className="bg-slate-200 text-slate-600 px-3 py-1 text-sm rounded-full font-medium">
              Admin
            </span>
          </div>
            <div className="flex items-center gap-4">
           <SignedIn>
            <UserButton afterSignOutUrl="/login" />
           
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-full shadow-lg transition-all hover:scale-105"
          >
            
            <Plus className="w-5 h-5" />
            
            Add New Content
          </button>
      </SignedIn>
      </div>
        </header>
        
        <div className="relative mb-6">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-3 py-3 w-full max-w-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {error ? (
          <div className="p-12 text-center bg-white shadow-lg rounded-xl">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">Error</h3>
            <p className="text-red-500">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="p-12 text-center bg-white shadow-lg rounded-xl">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Content Found</h3>
            <p className="text-slate-500">
              {searchTerm
                ? "No content matches your search criteria."
                : "Start by adding your first book or promo image to the library."}
            </p>
            {!searchTerm && (
              <button
                onClick={() => handleOpenModal()}
                className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-xl shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Content
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white p-6 shadow-xl rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500 uppercase text-left">
                    <th className="py-4 px-4 font-semibold">Image</th>
                    <th className="py-4 px-4 font-semibold">Title</th>
                    <th className="py-4 px-4 font-semibold">Type</th>
                    <th className="py-4 px-4 font-semibold hidden md:table-cell">Status</th>
                    <th className="py-4 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContents.map((c) => (
                    <tr key={c._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                          {isBook(c) && c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                          ) : isPromo(c) && c.promoImageUrl ? (
                            <img src={c.promoImageUrl} alt={c.title || "Promo"} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-800 font-medium">
                        <h3 className="line-clamp-2">{isBook(c) ? c.title : c.title || "Promotional Image"}</h3>
                        {isBook(c) && <p className="text-sm text-slate-500">by {c.author}</p>}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-sm font-medium text-slate-700">
                          {c.contentType === "book" ? "Book" : "Promo"}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        {(isBook(c) && c.isFeatured) || (isPromo(c) && c.isActive) ? (
                          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 text-sm font-medium">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 px-3 py-1 text-sm font-medium">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleOpenModal(c)}
                            className="p-2 rounded-full text-blue-500 border border-blue-200 hover:bg-blue-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id!, c.contentType)}
                            className="p-2 rounded-full text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal Dialog for Add/Edit Form */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-slate-800">
              {editingContent?._id ? "Edit Content" : "Add New Content"}
            </h2>
            {editingContent?._id ? <Edit className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
          </div>
          <p className="text-slate-600 mb-6">
            {editingContent?._id ? "Update the content information below." : "Fill in the required information for the book or promotional image."}
          </p>
          {editingContent && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="contentType" className="text-base font-semibold text-slate-700 block">
                  Content Type
                </label>
                <select
                  name="contentType"
                  id="contentType"
                  className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700"
                  value={editingContent.contentType}
                  onChange={handleContentTypeChange}
                  disabled={!!editingContent._id}
                >
                  <option value="book">📖 Book</option>
                  <option value="image">🖼️ Promotional Image</option>
                </select>
              </div>
              {isBook(editingContent) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EnhancedInputField
                    name="title"
                    label="Book Title"
                    value={editingContent.title}
                    onChange={handleInputChange}
                    required
                    icon={<BookOpen className="w-4 h-4 text-slate-500" />}
                  />
                  <EnhancedInputField
                    name="author"
                    label="Author Name"
                    value={editingContent.author}
                    onChange={handleInputChange}
                    required
                    icon={<Users className="w-4 h-4 text-slate-500" />}
                  />
                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <label htmlFor="description" className="text-base font-semibold text-slate-700 block">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={editingContent.description}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-slate-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-700 min-h-[100px]"
                      />
                    </div>
                  </div>
                  <EnhancedInputField
                    name="imageUrl"
                    label="Cover Image URL"
                    value={editingContent.imageUrl}
                    onChange={handleInputChange}
                    required
                    icon={<ImageIcon className="w-4 h-4 text-slate-500" />}
                  />
                  <EnhancedInputField
                    name="pdfUrl"
                    label="PDF File URL"
                    value={editingContent.pdfUrl}
                    onChange={handleInputChange}
                    required
                    icon={<FileText className="w-4 h-4 text-slate-500" />}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <EnhancedInputField
                    name="title"
                    label="Promo Title"
                    value={editingContent.title || ""}
                    onChange={handleInputChange}
                    icon={<BookOpen className="w-4 h-4 text-slate-500" />}
                  />
                  <EnhancedInputField
                    name="promoImageUrl"
                    label="Promotional Image URL"
                    value={editingContent.promoImageUrl}
                    onChange={handleInputChange}
                    required
                    icon={<ImageIcon className="w-4 h-4 text-slate-500" />}
                  />
                </div>
              )}
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name={isBook(editingContent) ? "isFeatured" : "isActive"}
                  checked={isBook(editingContent) ? editingContent.isFeatured : editingContent.isActive}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                />
                <div>
                  <label htmlFor="isFeatured" className="font-medium text-slate-700 cursor-pointer">
                    {isBook(editingContent) ? "Is Featured" : "Is Active"}
                  </label>
                  <p className="text-sm text-slate-600">
                    This {editingContent.contentType === "book" ? "book" : "promo image"} will be featured on the main page.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {editingContent._id ? "Updating..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      {editingContent._id ? <Save className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                      {editingContent._id ? "Update Content" : "Add Content"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-8 py-3 text-lg rounded-xl border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}