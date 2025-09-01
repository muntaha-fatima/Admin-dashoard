// 



// "use client";

// import { useEffect, useState } from "react";
// import { fetchAllCouponsPaginated, deleteCoupon, Coupon } from "@/lib/api";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// export default function CouponList() {
//   const [coupons, setCoupons] = useState<Coupon[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadCoupons = async () => {
//     try {
//       const data = await fetchAllCouponsPaginated();
//       setCoupons(data);
//     } catch (err) {
//       console.error("Failed to load coupons", err);
//       toast.error("Failed to fetch coupons");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (couponId: string) => {
//     const token = localStorage.getItem("token");
//     if (!token) return toast.error("Token not found!");

//     try {
//       await deleteCoupon(couponId, token);
//       toast.success("Coupon deleted");
//       loadCoupons();
//     } catch (err) {
//       console.error("Delete error:", err);
//       toast.error("Failed to delete coupon");
//     }
//   };

//   useEffect(() => {
//     loadCoupons();
//   }, []);

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-semibold">Coupon List</h2>

//       {loading ? (
//         <p>Loading coupons...</p>
//       ) : coupons.length === 0 ? (
//         <p>No coupons found.</p>
//       ) : (
//         coupons.map((coupon) => (
//           <Card
//             key={coupon._id}
//             className="p-4 flex justify-between items-center"
//           >
//             <div className="space-y-1">
//               <div className="font-medium text-lg">{coupon.offerDetails}</div>
//               {coupon.code && (
//                 <div className="text-sm text-muted-foreground">
//                   Code: {coupon.code}
//                 </div>
//               )}
//               {coupon.store && (
//                 <div className="text-sm text-muted-foreground">
//                   Store: {coupon.store}
//                 </div>
//               )}
//               <div className="text-xs text-gray-500">
//                 Hits: {coupon.hits} | Last Accessed:{" "}
//                 {new Date(coupon.lastAccessed).toLocaleDateString()}
//               </div>
//             </div>

//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={() => handleDelete(coupon._id)}
//             >
//               Delete
//             </Button>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// }

















// 'use client'

// import { useEffect, useState } from 'react'
// import {
//   fetchCoupons,
//   createCoupon,
//   deleteCoupon,

//   type Coupon,
//   type CreateCouponInput
// } from '@/lib/firebase'
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { toast } from 'sonner'
// import { Loader2 } from 'lucide-react'
// import Image from 'next/image'

// export default function CouponsPage() {
//   const [coupons, setCoupons] = useState<Coupon[]>([])
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)
//   const [deletingIds, setDeletingIds] = useState<string[]>([])
//   const [token, setToken] = useState<string | null>(null)

//   const [form, setForm] = useState<CreateCouponInput>({
//     offerDetails: '',
//     code: '',
//     store: '',
//     active: true,
//     isValid: true,
//     featuredForHome: false,
//     expirationDate: ''
//   })

//   useEffect(() => {
//     const storedToken = localStorage.getItem('token')
//     if (!storedToken) {
//       toast.error('Please login to view or manage coupons')
//     }
//     setToken(storedToken)
//   }, [])

//   useEffect(() => {
//     if (token) loadCoupons()
//   }, [token])

//   const loadCoupons = async () => {
//     setLoading(true)
//     try {
//       const data = await fetchCoupons()
//       setCoupons(data)
//     } catch (err) {
//       console.error(err)
//       toast.error('Failed to load coupons')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreate = async () => {
//     if (!token) return toast.error('Login required')
//     if (!form.offerDetails.trim()) return toast.error('Offer details are required')
//     if (!form.store) return toast.error('Store ID is required')

//     setSubmitting(true)
//     try {
//       await createCoupon(form, token)
//       toast.success('Coupon created successfully')
//       setForm({
//         offerDetails: '',
//         code: '',
//         store: '',
//         active: true,
//         isValid: true,
//         featuredForHome: false,
//         expirationDate: ''
//       })
//       loadCoupons()
//     } catch (err) {
//       console.error(err)
//       toast.error('Failed to create coupon')
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleDelete = async (id: string) => {
//     if (!token) return toast.error('Login required')
//     if (!window.confirm('Delete this coupon?')) return

//     setDeletingIds(prev => [...prev, id])
//     try {
//       await deleteCoupon(id, token)
//       toast.success('Deleted successfully')
//       loadCoupons()
//     } catch (err) {
//       console.error(err)
//       toast.error('Delete failed')
//     } finally {
//       setDeletingIds(prev => prev.filter(x => x !== id))
//     }
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Create Coupon</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Label>Offer Details</Label>
//               <Input
//                 value={form.offerDetails}
//                 onChange={e => setForm({ ...form, offerDetails: e.target.value })}
//                 placeholder="50% off on all items"
//               />
//             </div>
//             <div>
//               <Label>Coupon Code (optional)</Label>
//               <Input
//                 value={form.code}
//                 onChange={e => setForm({ ...form, code: e.target.value })}
//                 placeholder="COUPON123"
//               />
//             </div>
//             <div>
//               <Label>Store ID</Label>
//               <Input
//                 value={form.store}
//                 onChange={e => setForm({ ...form, store: e.target.value })}
//                 placeholder="storeId"
//               />
//             </div>
//             <div>
//               <Label>Expiration Date</Label>
//               <Input
//                 type="datetime-local"
//                 value={form.expirationDate}
//                 onChange={e => setForm({ ...form, expirationDate: e.target.value })}
//               />
//             </div>
//           </div>
//           <Button onClick={handleCreate} disabled={submitting}>
//             {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Create Coupon'}
//           </Button>
//         </CardContent>
//       </Card>

//       <div>
//         <h2 className="text-xl font-semibold mb-4">Coupons</h2>
//         {loading ? (
//           <div className="flex justify-center p-8">
//             <Loader2 className="h-8 w-8 animate-spin text-primary" />
//           </div>
//         ) : coupons.length === 0 ? (
//           <p className="text-center text-muted-foreground p-8">No coupons found</p>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {coupons.map(coupon => (
//               <Card key={coupon._id}>
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg">{coupon.offerDetails}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-2">
//                   <div className="text-sm">
//                     <p><strong>Code:</strong> {coupon.code || 'N/A'}</p>
//                     <p><strong>Valid:</strong> {coupon.isValid ? 'Yes' : 'No'}</p>
//                     <p><strong>Active:</strong> {coupon.active ? 'Yes' : 'No'}</p>
//                     <p><strong>Expires:</strong> {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'N/A'}</p>
//                   </div>
//                   <div className="flex items-center gap-3 mt-2">
//                     {coupon.store?.image?.url && (
//                       <Image
//                         src={coupon.store.image.url}
//                         alt={coupon.store.image.alt || coupon.store.name}
//                         width={48}
//                         height={48}
//                         className="rounded border"
//                       />
//                     )}
//                     <div>
//                       <p className="font-medium">{coupon.store?.name || 'Unknown Store'}</p>
//                       <p className="text-xs text-muted-foreground">{coupon.store?.trackingUrl}</p>
//                     </div>
//                   </div>
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDelete(coupon._id)}
//                     disabled={deletingIds.includes(coupon._id)}
//                   >
//                     {deletingIds.includes(coupon._id) ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Deleting...
//                       </>
//                     ) : (
//                       'Delete'
//                     )}
//                   </Button>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }"use client"

// import { FirebaseLogin } from "@/components/firebase-login"
// import { FirebaseDashboard } from "@/components/firebase-dashboard"
// import { useAuth } from "@/hooks/useAuth"
// import { Loader2 } from "lucide-react"

// export default function Home() {
//   const { user, loading } = useAuth()

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (!user) {
//     return <FirebaseLogin />
//   }

//   return <FirebaseDashboard />
// }








import { redirect } from "next/navigation"

export default function Home() {

  
  redirect("/login")
}