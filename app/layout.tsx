import type { Metadata } from 'next';
import './image-lp.css';
import './original.css';
import './brushup.css';
import './white-lp.css';
import './cta-refinement.css';
export const metadata: Metadata = {title:'法人・店舗向け10ギガ光回線｜フレッツ光クロスBIZ',description:'法人・店舗・個人事業主のインターネットに、フレッツ光クロスBIZ。10ギガ光回線の料金、提供エリア、店舗Wi-Fi、乗り換えや工事の疑問をご案内します。',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}
