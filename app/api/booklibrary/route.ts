

// import { type NextRequest, NextResponse } from "next/server"
// import { connectToDatabase } from "@/lib/mongodb"
// import { Book } from "@/models/Book"
// import { Promo } from "@/models/promoimage"

// // ✅ Allowed origins (Prod only)
// const allowedOrigins = [
//   "https://frontend-rho-jet-76.vercel.app", // Admin Dashboard (deployed)
//   "https://book-website-rho-sooty.vercel.app", // Book Website (deployed)
//   "http://localhost:3000",
//   "http://localhost:3001",
// ]

// // ✅ Utility: decide which origin to allow
// function getAllowOrigin(origin: string | null) {
//   if (!origin) return "" // No CORS header for non-browser/server-to-server
//   // Allow all origins in development
//   if (process.env.NODE_ENV === "development") {
//     console.log("🔧 Dev mode - Allowing origin:", origin)
//     return origin
//   }
//   // Strict check for production
//   if (allowedOrigins.includes(origin)) {
//     console.log("✅ Prod mode - Allowing origin:", origin)
//     return origin
//   }
//   console.log("❌ Origin not allowed:", origin)
//   return ""
// }

// // ✅ CORS helper
// function withCORS(res: NextResponse, req: NextRequest) {
//   const origin = req.headers.get("origin")
//   const allowOrigin = getAllowOrigin(origin)
//   if (allowOrigin) {
//     res.headers.set("Access-Control-Allow-Origin", allowOrigin)
//     res.headers.set("Vary", "Origin")
//   }
//   res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
//   return res
// }

// // ✅ Helper: Get proper host and protocol
// function getBaseUrl(req: NextRequest) {
//   const host = req.headers.get("host")
//   const isDevelopment = process.env.NODE_ENV === "development"
//   if (isDevelopment) {
//     // Local development
//     const protocol = "http"
//     const finalHost = host || "localhost:3000"
//     console.log("🔧 Dev Base URL:", `${protocol}://${finalHost}`)
//     return { protocol, host: finalHost }
//   } else {
//     // Production
//     const protocol = req.headers.get("x-forwarded-proto") || "https"
//     const finalHost = host || "frontend-rho-jet-76.vercel.app"
//     console.log("🚀 Prod Base URL:", `${protocol}://${finalHost}`)
//     return { protocol, host: finalHost }
//   }
// }

// // ✅ Helper: Convert relative URLs to absolute
// function makeAbsoluteUrl(url: string | undefined, baseProtocol: string, baseHost: string) {
//   if (!url) return ""
//   // Already absolute URL
//   if (url.startsWith("http")) {
//     return url
//   }
//   // Make relative URL absolute
//   const absoluteUrl = `${baseProtocol}://${baseHost}${url.startsWith("/") ? url : "/" + url}`
//   console.log("🔗 Converting URL:", url, "→", absoluteUrl)
//   return absoluteUrl
// }

// // ✅ OPTIONS (preflight)
// export async function OPTIONS(req: NextRequest) {
//   console.log("🔄 CORS Preflight request")
//   const res = new NextResponse(null, { status: 204 })
//   return withCORS(res, req)
// }

// export async function GET(req: NextRequest) {
//   try {
//     console.log("📖 GET Books and Promo request")
//     await connectToDatabase()
//     const { searchParams } = new URL(req.url)
//     const isFeatured = searchParams.get("featured")
//     const purpose = searchParams.get("purpose") // 🔍 'book', 'promo', or null (both)

//     const { protocol, host } = getBaseUrl(req)

//     let allItems: any[] = []

//     if (purpose === "promo") {
//       // ✅ Only promo images
//       const promoImages = await Promo.find({ isActive: true }).sort({ createdAt: -1 }).limit(1)
//       console.log("🔍 Promo Images fetched from DB:", promoImages)
//       allItems = promoImages.map((item: any) => ({
//         _id: item._id,
//         promoImageUrl: makeAbsoluteUrl(item.promoImageUrl, protocol, host),
//         contentType: "image",
//         isFeatured: item.isActive,
//       }))
//     } else if (purpose === "book") {
//       // ✅ Only books
//       const bookFilter = isFeatured === "true" ? { isFeatured: true } : {}
//       const books = await Book.find(bookFilter).sort({ createdAt: -1 })
//       allItems = books.map((book: any) => {
//         const bookObj = book.toObject()
//         return {
//           ...bookObj,
//           imageUrl: makeAbsoluteUrl(bookObj.imageUrl, protocol, host),
//           pdfUrl: makeAbsoluteUrl(bookObj.pdfUrl, protocol, host),
//           contentType: "book",
//         }
//       })
//     } else {
//       // ✅ Default: Both books and promo images
//       const bookFilter = isFeatured === "true" ? { isFeatured: true } : {}
//       const books = await Book.find(bookFilter).sort({ createdAt: -1 })
//       const booksWithFullUrl = books.map((book: any) => {
//         const bookObj = book.toObject()
//         return {
//           ...bookObj,
//           imageUrl: makeAbsoluteUrl(bookObj.imageUrl, protocol, host),
//           pdfUrl: makeAbsoluteUrl(bookObj.pdfUrl, protocol, host),
//           contentType: "book",
//         }
//       })

//       const promoImages = await Promo.find({ isActive: true }).sort({ createdAt: -1 })

//       const promoImagesWithFullUrl = promoImages.map((item: any) => ({
//         _id: item._id,
//         promoImageUrl: makeAbsoluteUrl(item.promoImageUrl, protocol, host),
//         contentType: "image",
//         isFeatured: item.isActive,
//       }))

//       allItems = [...booksWithFullUrl, ...promoImagesWithFullUrl]
//     }

//     console.log("✅ Returning", allItems.length, "items")
//     const res = NextResponse.json(allItems, { status: 200 })
//     return withCORS(res, req)
//   } catch (error) {
//     console.error("❌ GET Error:", error)
//     const res = NextResponse.json({ message: "Server Error" }, { status: 500 })
//     return withCORS(res, req)
//   }
// }

// export async function POST(req: NextRequest) {
//   await connectToDatabase()
//   const data = await req.json()

//   try {
//     const { protocol, host } = getBaseUrl(req) // Get base URL for absolute paths

//     if (data.contentType === "image") {
//       // 👉 Promo data
//       const promo = new Promo({
//   promoImageUrl: makeAbsoluteUrl(data.promoImageUrl, protocol, host),
//   isActive: data.isFeatured !== undefined ? data.isFeatured : true, // ✅ Yeh line add karo
// })

//       await promo.save()
//       return NextResponse.json({ success: true, message: "Promo added", promo })
//     } else if (data.contentType === "book") {
//       // 👉 Book data
//       const book = new Book({
//         title: data.title,
//         author: data.author,
//         description: data.description,
//         imageUrl: makeAbsoluteUrl(data.imageUrl, protocol, host),
//         pdfUrl: makeAbsoluteUrl(data.pdfUrl, protocol, host),
//         isFeatured: data.isFeatured,
//         contentType: "book",
//       })
//       await book.save()
//       return NextResponse.json({ success: true, message: "Book added", book })
//     } else {
//       return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 })
//     }
//   } catch (err) {
//     console.error(err)
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
//   }
// }

// // ✅ PUT handler (for updating books and promo images)
// export async function PUT(req: NextRequest) {
//   try {
//     console.log("✏️ PUT request")
//     await connectToDatabase()
//     const { searchParams } = new URL(req.url)
//     const id = searchParams.get("id")

//     if (!id) {
//       console.log("❌ Missing entry ID for update")
//       const res = NextResponse.json({ message: "Missing entry ID" }, { status: 400 })
//       return withCORS(res, req)
//     }

//     const body = await req.json()
//     const { contentType, title, author, description, imageUrl, pdfUrl, promoImageUrl, isFeatured } = body

//     console.log("📝 Received data for PUT:", { id, contentType, title, promoImageUrl, isFeatured })

//     const { protocol, host } = getBaseUrl(req)

//     if (contentType === "book") {
//       const updatedData = {
//         title,
//         author,
//         description,
//         imageUrl: makeAbsoluteUrl(imageUrl, protocol, host),
//         pdfUrl: makeAbsoluteUrl(pdfUrl, protocol, host),
//         isFeatured,
//         contentType: "book",
//       }
//       console.log("💾 Updating Book entry with processed data:", updatedData)
//       const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
//         new: true,
//         runValidators: true,
//       })

//       if (!updatedBook) {
//         console.log("❌ Book entry not found for update:", id)
//         const res = NextResponse.json({ message: "Book entry not found" }, { status: 404 })
//         return withCORS(res, req)
//       }

//       console.log("✅ Book entry updated successfully:", updatedBook._id)
//       const res = NextResponse.json(updatedBook, { status: 200 })
//       return withCORS(res, req)
//     } else if (contentType === "image") {
//       const updatedData = {
//         promoImageUrl: makeAbsoluteUrl(promoImageUrl, protocol, host),
//         isActive: isFeatured, // Use isFeatured from form as isActive for Promo model
//       }
//       console.log("💾 Updating Promo entry with processed data:", updatedData)
//       const updatedPromo = await Promo.findByIdAndUpdate(id, updatedData, {
//         new: true,
//         runValidators: true,
//       })

//       if (!updatedPromo) {
//         console.log("❌ Promo entry not found for update:", id)
//         const res = NextResponse.json({ message: "Promo entry not found" }, { status: 404 })
//         return withCORS(res, req)
//       }

//       console.log("✅ Promo entry updated successfully:", updatedPromo._id)
//       const res = NextResponse.json(updatedPromo, { status: 200 })
//       return withCORS(res, req)
//     } else {
//       throw new Error("Invalid contentType provided. Must be 'book' or 'image'.")
//     }
//   } catch (error) {
//     console.error("❌ PUT Error:", error)
//     const res = NextResponse.json({ message: "Server Error" }, { status: 500 })
//     return withCORS(res, req)
//   }
// }

// // ✅ DELETE handler
// export async function DELETE(req: NextRequest) {
//   try {
//     console.log("🗑️ DELETE request")
//     await connectToDatabase()
//     const { searchParams } = new URL(req.url)
//     const id = searchParams.get("id")
//     const type = searchParams.get("type") // Added type to distinguish between Book and Promo deletion

//     if (!id) {
//       console.log("❌ Missing ID for delete")
//       const res = NextResponse.json({ message: "Missing ID" }, { status: 400 })
//       return withCORS(res, req)
//     }

//     let deletedEntry

//     if (type === "book") {
//       console.log("🔍 Deleting book with ID:", id)
//       deletedEntry = await Book.findByIdAndDelete(id)
//     } else if (type === "promo") {
//       console.log("🔍 Deleting promo with ID:", id)
//       deletedEntry = await Promo.findByIdAndDelete(id)
//     } else {
//       // If type is not specified, try deleting from both for robustness
//       console.log("🔍 Deleting entry (type not specified, trying both models) with ID:", id)
//       deletedEntry = await Book.findByIdAndDelete(id)
//       if (!deletedEntry) {
//         deletedEntry = await Promo.findByIdAndDelete(id) // Try promo if not found in books
//       }
//     }

//     if (!deletedEntry) {
//       console.log("❌ Entry not found for deletion:", id)
//       const res = NextResponse.json({ message: "Entry not found" }, { status: 404 })
//       return withCORS(res, req)
//     }

//     console.log("✅ Entry deleted successfully:", id)
//     const res = NextResponse.json({ message: "Entry deleted successfully" }, { status: 200 })
//     return withCORS(res, req)
//   } catch (error) {
//     console.error("❌ DELETE Error:", error)
//     const res = NextResponse.json({ message: "Server Error" }, { status: 500 })
//     return withCORS(res, req)
//   }
// }





// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { Book } from "../../../models/book";
// import { Promo } from "../../../models/promoimage";

// // Allowed origins
// const allowedOrigins = [
//   "https://frontend-rho-jet-76.vercel.app",
//   "https://book-website-rho-sooty.vercel.app",
//   "http://localhost:3000",
//   "http://localhost:3001",
// ];

// function getAllowOrigin(origin: string | null) {
//   if (!origin) return "";
//   if (process.env.NODE_ENV === "development") {
//     console.log("🔧 Dev mode - Allowing origin:", origin);
//     return origin;
//   }
//   if (allowedOrigins.includes(origin)) {
//     console.log("✅ Prod mode - Allowing origin:", origin);
//     return origin;
//   }
//   console.log("❌ Origin not allowed:", origin);
//   return "";
// }

// function withCORS(res: NextResponse, req: NextRequest) {
//   const origin = req.headers.get("origin");
//   const allowOrigin = getAllowOrigin(origin);
//   if (allowOrigin) {
//     res.headers.set("Access-Control-Allow-Origin", allowOrigin);
//     res.headers.set("Vary", "Origin");
//   }
//   res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   return res;
// }

// function getBaseUrl(req: NextRequest) {
//   const host = req.headers.get("host");
//   const isDevelopment = process.env.NODE_ENV === "development";
//   if (isDevelopment) {
//     const protocol = "http";
//     const finalHost = host || "";
//     console.log("🔧 Dev Base URL:", `${protocol}://${finalHost}`);
//     return { protocol, host: finalHost };
//   } else {
//     const protocol = req.headers.get("x-forwarded-proto") || "https";
//     const finalHost = host || "frontend-rho-jet-76.vercel.app";
//     console.log("🚀 Prod Base URL:", `${protocol}://${finalHost}`);
//     return { protocol, host: finalHost };
//   }
// }

// function makeAbsoluteUrl(url: string | undefined, baseProtocol: string, baseHost: string) {
//   if (!url || url.trim() === "") {
//     console.log("❌ Invalid URL:", url);
//     return "";
//   }
//   if (url.startsWith("http")) {
//     return url;
//   }
//   const absoluteUrl = `${baseProtocol}://${baseHost}${url.startsWith("/") ? url : "/" + url}`;
//   console.log("🔗 Converting URL:", url, "→", absoluteUrl);
//   return absoluteUrl;
// }

// export async function OPTIONS(req: NextRequest) {
//   console.log("🔄 CORS Preflight request for Admin Content");
//   const res = new NextResponse(null, { status: 204 });
//   return withCORS(res, req);
// }

// export async function POST(req: NextRequest) {
//   try {
//     console.log("📖 POST Admin Content request");
//     await connectToDatabase();

//     const data = await req.json();
//     const { contentType } = data;
//     const { protocol, host } = getBaseUrl(req);

//     // ⚠️ Validate contentType
//     if (!contentType || (contentType !== "book" && contentType !== "image")) {
//       console.log("❌ Invalid contentType:", contentType);
//       return withCORS(
//         NextResponse.json({ success: false, message: "Invalid contentType: must be 'book' or 'image'" }, { status: 400 }),
//         req
//       );
//     }

//     // 📚 Book Content Handling
//     if (contentType === "book") {
//       const { title, author, description, imageUrl, pdfUrl, isFeatured } = data;
//       if (!title || !author || !description || !imageUrl || !pdfUrl || isFeatured === undefined) {
//         console.log("❌ Missing required book fields:", { title, author, description, imageUrl, pdfUrl, isFeatured });
//         return withCORS(
//           NextResponse.json(
//             { success: false, message: "Missing required book fields: title, author, description, imageUrl, pdfUrl, isFeatured" },
//             { status: 400 }
//           ),
//           req
//         );
//       }
//       const absoluteImageUrl = makeAbsoluteUrl(imageUrl, protocol, host);
//       const absolutePdfUrl = makeAbsoluteUrl(pdfUrl, protocol, host);
//       if (!absoluteImageUrl || !absolutePdfUrl) {
//         console.log("❌ Invalid book URLs:", { imageUrl, pdfUrl });
//         return withCORS(
//           NextResponse.json(
//             { success: false, message: "Invalid imageUrl or pdfUrl for book" },
//             { status: 400 }
//           ),
//           req
//         );
//       }
//       const book = new Book({
//         title: title.trim(),
//         author: author.trim(),
//         description: description.trim(),
//         imageUrl: absoluteImageUrl,
//         pdfUrl: absolutePdfUrl,
//         isFeatured: !!isFeatured,
//         contentType: "book",
//       });
//       await book.save();
//       console.log("✅ Book added:", book._id);
//       return withCORS(
//         NextResponse.json({ success: true, message: "Book added successfully", item: book }, { status: 201 }),
//         req
//       );
//     }

//     // 🖼️ Promo Image Handling
//     if (contentType === "image") {
//       const { promoImageUrl, isFeatured, title } = data;
//       if (!promoImageUrl || typeof promoImageUrl !== "string" || promoImageUrl.trim() === "") {
//         console.log("❌ Invalid or missing promoImageUrl:", promoImageUrl);
//         return withCORS(
//           NextResponse.json(
//             { success: false, message: "promoImageUrl is required and must be a valid non-empty string" },
//             { status: 400 }
//           ),
//           req
//         );
//       }
//       if (isFeatured === undefined) {
//         console.log("❌ Missing isFeatured for promo image");
//         return withCORS(
//           NextResponse.json({ success: false, message: "isFeatured is required for promo images" }, { status: 400 }),
//           req
//         );
//       }
//       // Prevent book-related fields in promo
//       if (data.imageUrl || data.pdfUrl || data.author || data.description) {
//         console.log("❌ Book fields detected in promo request:", { imageUrl: data.imageUrl, pdfUrl: data.pdfUrl });
//         return withCORS(
//           NextResponse.json(
//             { success: false, message: "Book fields (imageUrl, pdfUrl, author, description) not allowed in promo request" },
//             { status: 400 }
//           ),
//           req
//         );
//       }
//       const absolutePromoImageUrl = makeAbsoluteUrl(promoImageUrl, protocol, host);
//       if (!absolutePromoImageUrl) {
//         console.log("❌ Failed to convert promoImageUrl to absolute URL:", promoImageUrl);
//         return withCORS(
//           NextResponse.json(
//             { success: false, message: "Invalid promoImageUrl: could not convert to absolute URL" },
//             { status: 400 }
//           ),
//           req
//         );
//       }
//       const promo = new Promo({
//         promoImageUrl: absolutePromoImageUrl,
//         isActive: !!isFeatured,
//         contentType: "image",
//         title: title && typeof title === "string" && title.trim() !== "" ? title.trim() : "Promo Image",
//       });
//       await promo.save();
//       console.log("✅ Promo added:", promo._id, "with URL:", absolutePromoImageUrl);
//       return withCORS(
//         NextResponse.json({ success: true, message: "Promo added successfully", item: promo }, { status: 201 }),
//         req
//       );
//     }
//   } catch (error) {
//     console.error("❌ POST Error:", error);
//     return withCORS(NextResponse.json({ success: false, message: "Server error" }, { status: 500 }), req);
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     console.log("📖 GET Books + Promo request");
//     await connectToDatabase();

//     const { searchParams } = new URL(req.url);
//     const purpose = searchParams.get("purpose");
//     const isFeatured = searchParams.get("featured");
//     const { protocol, host } = getBaseUrl(req);

//     if (purpose === "promo") {
//       const promoImages = await Promo.find({ isActive: true, promoImageUrl: { $ne: null }, contentType: "image" }).sort({ createdAt: -1 });
//       const promoImagesWithFullUrl = promoImages
//         .map((item: any) => {
//           const promoImageUrl = makeAbsoluteUrl(item.promoImageUrl, protocol, host);
//           if (!promoImageUrl) return null;
//           return {
//             _id: item._id,
//             promoImageUrl,
//             isActive: item.isActive,
//             contentType: "image",
//             title: item.title || "Promo Image",
//           };
//         })
//         .filter((item: any) => item !== null);

//       console.log("🖼️ Fetched", promoImagesWithFullUrl.length, "promo images");
//       return withCORS(NextResponse.json(promoImagesWithFullUrl, { status: 200 }), req);
//     }

//     const filter = isFeatured === "true" ? { isFeatured: true } : {};
//     const books = await Book.find(filter).sort({ createdAt: -1 });
//     const booksWithFullUrl = books.map((book: any) => {
//       const bookObj = book.toObject();
//       return {
//         ...bookObj,
//         imageUrl: makeAbsoluteUrl(bookObj.imageUrl, protocol, host),
//         pdfUrl: makeAbsoluteUrl(bookObj.pdfUrl, protocol, host),
//         contentType: "book",
//       };
//     });

//     console.log("📚 Fetched", booksWithFullUrl.length, "books");
//     return withCORS(NextResponse.json(booksWithFullUrl, { status: 200 }), req);
//   } catch (error) {
//     console.error("❌ GET Error:", error);
//     return withCORS(NextResponse.json({ message: "Server Error" }, { status: 500 }), req);
//   }
// }

// // ✅ PUT handler for Admin Book/Promo Updates
// export async function PUT(req: NextRequest) {
//   try {
//     console.log("✏️ PUT Admin Content request")
//     await connectToDatabase()

//     const { searchParams } = new URL(req.url)
//     const id = searchParams.get("id")
//     const contentType = searchParams.get("contentType")

//     // 🔴 Basic validation
//     if (!id || !contentType || (contentType !== "book" && contentType !== "image")) {
//       console.log("❌ Missing or invalid id/contentType")
//       const res = NextResponse.json({ success: false, message: "Missing or invalid id/contentType" }, { status: 400 })
//       return withCORS(res, req)
//     }

//     const body = await req.json()
//     const { protocol, host } = getBaseUrl(req)

//     // 📚 Update Book
//     if (contentType === "book") {
//       const { title, author, description, imageUrl, pdfUrl, isFeatured } = body

//       const updatedBook = await Book.findByIdAndUpdate(
//         id,
//         {
//           title,
//           author,
//           description,
//           imageUrl: makeAbsoluteUrl(imageUrl, protocol, host),
//           pdfUrl: makeAbsoluteUrl(pdfUrl, protocol, host),
//           isFeatured: !!isFeatured,
//           contentType: "book",
//         },
//         { new: true, runValidators: true }
//       )

//       if (!updatedBook) {
//         console.log("❌ Book not found:", id)
//         const res = NextResponse.json({ success: false, message: "Book not found" }, { status: 404 })
//         return withCORS(res, req)
//       }

//       console.log("✅ Book updated:", updatedBook._id)
//       const res = NextResponse.json({ success: true, item: updatedBook }, { status: 200 })
//       return withCORS(res, req)
//     }

//     // 🖼️ Update Promo Image
//     if (contentType === "image") {
//       const { promoImageUrl, isFeatured } = body

//       const updatedPromo = await Promo.findByIdAndUpdate(
//         id,
//         {
//           promoImageUrl: makeAbsoluteUrl(promoImageUrl, protocol, host),
//           isActive: !!isFeatured,
//         },
//         { new: true, runValidators: true }
//       )

//       if (!updatedPromo) {
//         console.log("❌ Promo not found:", id)
//         const res = NextResponse.json({ success: false, message: "Promo not found" }, { status: 404 })
//         return withCORS(res, req)
//       }

//       console.log("✅ Promo updated:", updatedPromo._id)
//       const res = NextResponse.json({ success: true, item: updatedPromo }, { status: 200 })
//       return withCORS(res, req)
//     }

//   } catch (error) {
//     console.error("❌ PUT Admin Content Error:", error)
//     const res = NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
//     return withCORS(res, req)
//   }
// }


// // ✅ DELETE handler
// export async function DELETE(req: NextRequest) {
//   try {
//     console.log("🗑️ DELETE Admin Content request")
//     await connectToDatabase()
//     const { searchParams } = new URL(req.url)
//     const id = searchParams.get("id")
//     const contentType = searchParams.get("contentType")
//     if (!id || !contentType) {
//       console.log("❌ Missing id or contentType for admin delete")
//       const res = NextResponse.json({ message: "Missing id or contentType" }, { status: 400 })
//       return withCORS(res, req)
//     }

//     // 📚 Handle Book Deletion (Admin Dashboard)
//     if (contentType === "book") {
//       console.log("🔍 Deleting book with ID for admin:", id)
//       const deletedBook = await Book.findByIdAndDelete(id)
//       if (!deletedBook) {
//         console.log("❌ Book not found for admin:", id)
//         const res = NextResponse.json({ message: "Book not found" }, { status: 404 })
//         return withCORS(res, req)
//       }
//       console.log("✅ Book deleted successfully by admin:", id)
//       const res = NextResponse.json({ message: "Book deleted successfully" }, { status: 200 })
//       return withCORS(res, req)
//     }

//     // 📷 Handle Promo Deletion (Admin Dashboard)
//     if (contentType === "image") {
//       console.log("🔍 Deleting promo with ID for admin:", id)
//       const deletedPromo = await Promo.findByIdAndDelete(id)
//       if (!deletedPromo) {
//         console.log("❌ Promo not found for admin:", id)
//         const res = NextResponse.json({ message: "Promo not found" }, { status: 404 })
//         return withCORS(res, req)
//       }
//       console.log("✅ Promo deleted successfully by admin:", id)
//       const res = NextResponse.json({ message: "Promo deleted successfully" }, { status: 200 })
//       return withCORS(res, req)
//     }

//     // ❌ Invalid contentType
//     console.log("❌ Invalid contentType for admin:", contentType)
//     const res = NextResponse.json({ message: "Invalid contentType" }, { status: 400 })
//     return withCORS(res, req)
//   } catch (error) {
//     console.error("❌ DELETE Admin Content Error:", error)
//     const res = NextResponse.json({ message: "Server Error" }, { status: 500 })
//     return withCORS(res, req)
//   }
// }











// import { NextRequest, NextResponse } from "next/server";
// import { connectToDatabase } from "@/lib/mongodb";
// import { Book } from "../../../models/book";
// import { Promo } from "../../../models/promoimage";

// const allowedOrigins = [
//   "https://frontend-rho-jet-76.vercel.app",
//   "https://book-website-rho-sooty.vercel.app",
//   "http://localhost:3000",
//   "http://localhost:3001",
// ];

// function getAllowOrigin(origin: string | null) {
//   if (!origin) return "";
//   if (process.env.NODE_ENV === "development") {
//     console.log("🔧 Dev mode - Allowing origin:", origin);
//     return origin;
//   }
//   if (allowedOrigins.includes(origin)) {
//     console.log("✅ Prod mode - Allowing origin:", origin);
//     return origin;
//   }
//   console.log("❌ Origin not allowed:", origin);
//   return "";
// }

// function withCORS(res: NextResponse, req: NextRequest) {
//   const origin = req.headers.get("origin");
//   const allowOrigin = getAllowOrigin(origin);
//   if (allowOrigin) {
//     res.headers.set("Access-Control-Allow-Origin", allowOrigin);
//     res.headers.set("Vary", "Origin");
//   }
//   res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   return res;
// }

// export async function POST(req: NextRequest) {
//   try {
//     console.log("📖 Received POST request for book")
//     await connectToDatabase();

//     const data = await req.json();
//     const { contentType, title, author, description, imageUrl, pdfUrl, isFeatured } = data;

//     if (contentType !== "book") {
//       console.log("❌ Invalid contentType:", contentType);
//       return withCORS(
//         NextResponse.json({ success: false, message: "Invalid contentType: must be 'book'" }, { status: 400 }),
//         req
//       );
//     }

//     if (!title || !author || !description || !imageUrl || !pdfUrl || isFeatured === undefined) {
//       console.log("❌ Missing required book fields:", { title, author, description, imageUrl, pdfUrl, isFeatured });
//       return withCORS(
//         NextResponse.json(
//           { success: false, message: "Missing required book fields: title, author, description, imageUrl, pdfUrl, isFeatured" },
//           { status: 400 }
//         ),
//         req
//       );
//     }

//     // Explicitly exclude promoImageUrl
//     if ("promoImageUrl" in data) {
//       console.log("❌ promoImageUrl field detected in book data:", data.promoImageUrl);
//       delete data.promoImageUrl;
//     }

//     const book = new Book({
//       contentType: "book",
//       title: title.trim(),
//       author: author.trim(),
//       description: description.trim(),
//       imageUrl: imageUrl.trim(),
//       pdfUrl: pdfUrl.trim(),
//       isFeatured: !!isFeatured,
//     });
//     await book.save();
//     console.log("✅ Book added:", book._id);
//     return withCORS(
//       NextResponse.json({ success: true, message: "Book added successfully", item: book }, { status: 201 }),
//       req
//     );
//   } catch (error) {
//     console.error("❌ POST Error:", error);
//     return withCORS(NextResponse.json({ success: false, message: "Server error" }, { status: 500 }), req);
//   }
// }

// export async function OPTIONS(req: NextRequest) {
//   console.log("🔄 CORS Preflight request for Book Library");
//   const res = new NextResponse(null, { status: 204 });
//   return withCORS(res, req);
// }

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Book } from "@/models/books";

const allowedOrigins = [
  "https://frontend-rho-jet-76.vercel.app",
  "https://book-website-rho-sooty.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

function getAllowOrigin(origin: string | null) {
  if (!origin) return "";
  if (process.env.NODE_ENV === "development") {
    return origin;
  }
  if (allowedOrigins.includes(origin)) {
    return origin;
  }
  return "";
}

function withCORS(res: NextResponse, req: NextRequest) {
  const origin = req.headers.get("origin");
  const allowOrigin = getAllowOrigin(origin);
  if (allowOrigin) {
    res.headers.set("Access-Control-Allow-Origin", allowOrigin);
    res.headers.set("Vary", "Origin");
  }
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

// ✅ Helper: Convert relative URL to absolute
function makeAbsoluteUrl(url: string | undefined, req: NextRequest) {
  if (!url || url.trim() === "") return "";
  if (url.startsWith("http")) return url;
  const protocol = req.headers.get("x-forwarded-proto") || "http";
  const host = req.headers.get("host") || "localhost:3000";
  return `${protocol}://${host}${url.startsWith("/") ? url : "/" + url}`;
}

// 📌 CREATE Book
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const { contentType, title, author, description, imageUrl, pdfUrl, isFeatured } = data;

    if (contentType !== "book") {
      return withCORS(NextResponse.json({ success: false, message: "Invalid contentType: must be 'book'" }, { status: 400 }), req);
    }

    if (!title?.trim() || !author?.trim() || !description?.trim() || !imageUrl?.trim() || !pdfUrl?.trim() || isFeatured === undefined) {
      return withCORS(NextResponse.json({ success: false, message: "Missing or invalid book fields" }, { status: 400 }), req);
    }

    const absoluteImageUrl = makeAbsoluteUrl(imageUrl, req);
    const absolutePdfUrl = makeAbsoluteUrl(pdfUrl, req);

    if (!absoluteImageUrl || !absolutePdfUrl) {
      return withCORS(NextResponse.json({ success: false, message: "Invalid imageUrl or pdfUrl" }, { status: 400 }), req);
    }

    const book = new Book({
      contentType: "book",
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      imageUrl: absoluteImageUrl,
      pdfUrl: absolutePdfUrl,
      isFeatured: !!isFeatured,
    });

    await book.save();
    return withCORS(NextResponse.json({ success: true, message: "Book added successfully", item: book }, { status: 201 }), req);
  } catch (error) {
    console.error("POST Error:", error);
    return withCORS(NextResponse.json({ success: false, message: "Server error" }, { status: 500 }), req);
  }
}

// 📌 READ Books
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const books = await Book.find({});

    const booksWithAbsoluteUrls = books.map(book => ({
      ...book.toObject(),
      imageUrl: makeAbsoluteUrl(book.imageUrl, req),
      pdfUrl: makeAbsoluteUrl(book.pdfUrl, req),
    }));

    return withCORS(NextResponse.json({ success: true, data: booksWithAbsoluteUrls }, { status: 200 }), req);
  } catch (error) {
    console.error("GET Error:", error);
    return withCORS(NextResponse.json({ success: false, message: "Server error" }, { status: 500 }), req);
  }
}

// 📌 UPDATE Book
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const data = await req.json();

    if (!id) {
      return withCORS(NextResponse.json({ success: false, message: "ID is required" }, { status: 400 }), req);
    }

    if (data.imageUrl) data.imageUrl = makeAbsoluteUrl(data.imageUrl, req);
    if (data.pdfUrl) data.pdfUrl = makeAbsoluteUrl(data.pdfUrl, req);

    const updatedBook = await Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!updatedBook) {
      return withCORS(NextResponse.json({ success: false, message: "Book not found" }, { status: 404 }), req);
    }

    return withCORS(NextResponse.json({ success: true, message: "Book updated successfully", item: updatedBook }, { status: 200 }), req);
  } catch (error) {
    console.error("PUT Error:", error);
    return withCORS(NextResponse.json({ success: false, message: "Server error" }, { status: 500 }), req);
  }
}

// 📌 DELETE Book
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return withCORS(NextResponse.json({ success: false, message: "ID is required" }, { status: 400 }), req);
    }

    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return withCORS(NextResponse.json({ success: false, message: "Book not found" }, { status: 404 }), req);
    }

    return withCORS(NextResponse.json({ success: true, message: "Book deleted successfully" }, { status: 200 }), req);
  } catch (error) {
    console.error("DELETE Error:", error);
    return withCORS(NextResponse.json({ success: false, message: "Server error" }, { status: 500 }), req);
  }
}

// 📌 CORS Preflight
export async function OPTIONS(req: NextRequest) {
  const res = new NextResponse(null, { status: 204 });
  return withCORS(res, req);
}
