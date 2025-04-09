import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EduVN</h3>
            <p className="text-gray-400 mb-4">Nền tảng học trực tuyến hàng đầu Việt Nam với hơn 1,000 khóa học chất lượng cao từ các chuyên gia.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-400 hover:text-white">Trang chủ</a></Link></li>
              <li><Link href="/courses"><a className="text-gray-400 hover:text-white">Khóa học</a></Link></li>
              <li><Link href="/instructors"><a className="text-gray-400 hover:text-white">Giảng viên</a></Link></li>
              <li><Link href="/blog"><a className="text-gray-400 hover:text-white">Blog</a></Link></li>
              <li><Link href="/about"><a className="text-gray-400 hover:text-white">Về chúng tôi</a></Link></li>
              <li><Link href="/contact"><a className="text-gray-400 hover:text-white">Liên hệ</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              <li><Link href="/courses?category=lap-trinh-web"><a className="text-gray-400 hover:text-white">Lập trình web</a></Link></li>
              <li><Link href="/courses?category=phat-trien-di-dong"><a className="text-gray-400 hover:text-white">Phát triển di động</a></Link></li>
              <li><Link href="/courses?category=digital-marketing"><a className="text-gray-400 hover:text-white">Digital Marketing</a></Link></li>
              <li><Link href="/courses?category=thiet-ke-do-hoa"><a className="text-gray-400 hover:text-white">Thiết kế đồ họa</a></Link></li>
              <li><Link href="/courses?category=phat-trien-ca-nhan"><a className="text-gray-400 hover:text-white">Phát triển cá nhân</a></Link></li>
              <li><Link href="/courses?category=kinh-doanh"><a className="text-gray-400 hover:text-white">Kinh doanh</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><Link href="/support"><a className="text-gray-400 hover:text-white">Trung tâm hỗ trợ</a></Link></li>
              <li><Link href="/faq"><a className="text-gray-400 hover:text-white">Câu hỏi thường gặp</a></Link></li>
              <li><Link href="/privacy"><a className="text-gray-400 hover:text-white">Chính sách bảo mật</a></Link></li>
              <li><Link href="/terms"><a className="text-gray-400 hover:text-white">Điều khoản sử dụng</a></Link></li>
              <li><Link href="/refund"><a className="text-gray-400 hover:text-white">Chính sách hoàn tiền</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2023 EduVN. Tất cả các quyền được bảo lưu.</p>
          <div className="flex space-x-4">
            <img src="https://cdn.cdnlogo.com/logos/v/69/visa.svg" alt="Visa" className="h-8" />
            <img src="https://cdn.cdnlogo.com/logos/m/33/mastercard.svg" alt="Mastercard" className="h-8" />
            <img src="https://cdn.cdnlogo.com/logos/p/19/paypal.svg" alt="PayPal" className="h-8" />
            <img src="https://cdn.cdnlogo.com/logos/m/4/momo.svg" alt="MoMo" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
}
