#!/usr/bin/env python3
"""
Script to add 4 new languages (id, th, vi, tr) to content registry files.
This script processes TypeScript files and adds translations for text blocks
that only have 6 languages (en, ko, ar, ru, zh, es).
"""

import re
import sys

# Translation mappings for common patterns
# These are manually curated translations for the content

SERVER_TRANSLATIONS = {
    # Step 3 - API Key Integration title
    '"Buylow AI - API Key Integration"': {
        'id': '"Buylow AI - Integrasi Kunci API"',
        'th': '"Buylow AI - การเชื่อมต่อคีย์ API"',
        'vi': '"Buylow AI - Tích Hợp Khóa API"',
        'tr': '"Buylow AI - API Anahtarı Entegrasyonu"',
    },
    '"Start Creating API Key"': {
        'id': '"Mulai Buat Kunci API"',
        'th': '"เริ่มสร้างคีย์ API"',
        'vi': '"Bắt Đầu Tạo Khóa API"',
        'tr': '"API Anahtarı Oluşturmaya Başla"',
    },
    '"Create API Key [1]"': {
        'id': '"Buat Kunci API [1]"',
        'th': '"สร้างคีย์ API [1]"',
        'vi': '"Tạo Khóa API [1]"',
        'tr': '"API Anahtarı Oluştur [1]"',
    },
    '"Create API Key [2]"': {
        'id': '"Buat Kunci API [2]"',
        'th': '"สร้างคีย์ API [2]"',
        'vi': '"Tạo Khóa API [2]"',
        'tr': '"API Anahtarı Oluştur [2]"',
    },
    '"Create API Key [3]"': {
        'id': '"Buat Kunci API [3]"',
        'th': '"สร้างคีย์ API [3]"',
        'vi': '"Tạo Khóa API [3]"',
        'tr': '"API Anahtarı Oluştur [3]"',
    },
    '"API Key Creation Complete"': {
        'id': '"Pembuatan Kunci API Selesai"',
        'th': '"การสร้างคีย์ API เสร็จสมบูรณ์"',
        'vi': '"Hoàn Tất Tạo Khóa API"',
        'tr': '"API Anahtarı Oluşturma Tamamlandı"',
    },
    '"Search Render.com"': {
        'id': '"Cari Render.com"',
        'th': '"ค้นหา Render.com"',
        'vi': '"Tìm Render.com"',
        'tr': '"Render.com Ara"',
    },
    '"Access Render.com"': {
        'id': '"Akses Render.com"',
        'th': '"เข้าถึง Render.com"',
        'vi': '"Truy Cập Render.com"',
        'tr': '"Render.com Erişimi"',
    },
    '"Log in to Render.com"': {
        'id': '"Masuk ke Render.com"',
        'th': '"เข้าสู่ระบบ Render.com"',
        'vi': '"Đăng Nhập Render.com"',
        'tr': '"Render.com Giriş"',
    },
    '"Add Payment Method (1)"': {
        'id': '"Tambah Metode Pembayaran (1)"',
        'th': '"เพิ่มวิธีการชำระเงิน (1)"',
        'vi': '"Thêm Phương Thức Thanh Toán (1)"',
        'tr': '"Ödeme Yöntemi Ekle (1)"',
    },
    '"Add Payment Method (2)"': {
        'id': '"Tambah Metode Pembayaran (2)"',
        'th': '"เพิ่มวิธีการชำระเงิน (2)"',
        'vi': '"Thêm Phương Thức Thanh Toán (2)"',
        'tr': '"Ödeme Yöntemi Ekle (2)"',
    },
    '"Register Buylow AI Server (1)"': {
        'id': '"Daftar Server Buylow AI (1)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (1)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (1)"',
        'tr': '"Buylow AI Sunucusu Kaydet (1)"',
    },
    '"Register Buylow AI Server (2)"': {
        'id': '"Daftar Server Buylow AI (2)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (2)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (2)"',
        'tr': '"Buylow AI Sunucusu Kaydet (2)"',
    },
    '"Register Buylow AI Server (3)"': {
        'id': '"Daftar Server Buylow AI (3)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (3)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (3)"',
        'tr': '"Buylow AI Sunucusu Kaydet (3)"',
    },
    '"Register Buylow AI Server (4)"': {
        'id': '"Daftar Server Buylow AI (4)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (4)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (4)"',
        'tr': '"Buylow AI Sunucusu Kaydet (4)"',
    },
    '"Register Buylow AI Server (5)"': {
        'id': '"Daftar Server Buylow AI (5)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (5)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (5)"',
        'tr': '"Buylow AI Sunucusu Kaydet (5)"',
    },
    '"Register Buylow AI Server (6)"': {
        'id': '"Daftar Server Buylow AI (6)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (6)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (6)"',
        'tr': '"Buylow AI Sunucusu Kaydet (6)"',
    },
    '"Register Buylow AI Server (7)"': {
        'id': '"Daftar Server Buylow AI (7)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (7)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (7)"',
        'tr': '"Buylow AI Sunucusu Kaydet (7)"',
    },
    '"Register Buylow AI Server (8)"': {
        'id': '"Daftar Server Buylow AI (8)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (8)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (8)"',
        'tr': '"Buylow AI Sunucusu Kaydet (8)"',
    },
    '"Register Buylow AI Server (9)"': {
        'id': '"Daftar Server Buylow AI (9)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (9)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (9)"',
        'tr': '"Buylow AI Sunucusu Kaydet (9)"',
    },
    '"Register Buylow AI Server (10)"': {
        'id': '"Daftar Server Buylow AI (10)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (10)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (10)"',
        'tr': '"Buylow AI Sunucusu Kaydet (10)"',
    },
    '"Register Buylow AI Server (11)"': {
        'id': '"Daftar Server Buylow AI (11)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (11)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (11)"',
        'tr': '"Buylow AI Sunucusu Kaydet (11)"',
    },
    '"Register Buylow AI Server (12)"': {
        'id': '"Daftar Server Buylow AI (12)"',
        'th': '"ลงทะเบียนเซิร์ฟเวอร์ Buylow AI (12)"',
        'vi': '"Đăng Ký Máy Chủ Buylow AI (12)"',
        'tr': '"Buylow AI Sunucusu Kaydet (12)"',
    },
    '"Join [BotFather] Telegram"': {
        'id': '"Masuk [BotFather] Telegram"',
        'th': '"เข้าร่วม [BotFather] Telegram"',
        'vi': '"Tham Gia [BotFather] Telegram"',
        'tr': '"[BotFather] Telegram Katıl"',
    },
    '"Join [Userinfo] Telegram"': {
        'id': '"Masuk [Userinfo] Telegram"',
        'th': '"เข้าร่วม [Userinfo] Telegram"',
        'vi': '"Tham Gia [Userinfo] Telegram"',
        'tr': '"[Userinfo] Telegram Katıl"',
    },
    '"Appendix"': {
        'id': '"Lampiran"',
        'th': '"ภาคผนวก"',
        'vi': '"Phụ Lục"',
        'tr': '"Ek"',
    },
    # Step 4 title
    '"Create & Register Buylow AI Bot"': {
        'id': '"Buat & Daftar Bot Buylow AI"',
        'th': '"สร้างและลงทะเบียนบอท Buylow AI"',
        'vi': '"Tạo & Đăng Ký Bot Buylow AI"',
        'tr': '"Buylow AI Bot Oluştur ve Kaydet"',
    },
}

STRATEGY_TRANSLATIONS = {
    # Step 3 entry/take-profit
    '"Entry & Take-Profit Structure"': {
        'id': '"Struktur Entry & Take-Profit"',
        'th': '"โครงสร้างการเข้าและการทำกำไร"',
        'vi': '"Cấu Trúc Entry & Take-Profit"',
        'tr': '"Giriş ve Kar Al Yapısı"',
    },
    '"5-Minute Candle Entry Principle"': {
        'id': '"Prinsip Entry Candle 5 Menit"',
        'th': '"หลักการเข้าแท่งเทียน 5 นาที"',
        'vi': '"Nguyên Tắc Entry Nến 5 Phút"',
        'tr': '"5 Dakikalık Mum Giriş İlkesi"',
    },
    '"Entry Settings (Fibonacci Extensions)"': {
        'id': '"Pengaturan Entry (Ekstensi Fibonacci)"',
        'th': '"การตั้งค่าการเข้า (Fibonacci Extensions)"',
        'vi': '"Cài Đặt Entry (Fibonacci Extensions)"',
        'tr': '"Giriş Ayarları (Fibonacci Uzantıları)"',
    },
    '"Take-Profit Settings (Fibonacci Retracements)"': {
        'id': '"Pengaturan Take-Profit (Fibonacci Retracements)"',
        'th': '"การตั้งค่าการทำกำไร (Fibonacci Retracements)"',
        'vi': '"Cài Đặt Take-Profit (Fibonacci Retracements)"',
        'tr': '"Kar Al Ayarları (Fibonacci Düzeltmeleri)"',
    },
    # Step 4
    '"AI Auto Entry — 3 Levels"': {
        'id': '"AI Auto Entry — 3 Level"',
        'th': '"AI Auto Entry — 3 ระดับ"',
        'vi': '"AI Auto Entry — 3 Cấp Độ"',
        'tr': '"AI Otomatik Giriş — 3 Seviye"',
    },
    # Step 5
    '"Recommended Settings by Target Profit"': {
        'id': '"Pengaturan yang Direkomendasikan berdasarkan Target Profit"',
        'th': '"การตั้งค่าที่แนะนำตามเป้าหมายกำไร"',
        'vi': '"Cài Đặt Khuyến Nghị theo Mục Tiêu Lợi Nhuận"',
        'tr': '"Hedef Kâra Göre Önerilen Ayarlar"',
    },
    '"Recommended 1st Entry Size by Target Profit"': {
        'id': '"Ukuran Entry Pertama yang Direkomendasikan berdasarkan Target Profit"',
        'th': '"ขนาดการเข้าครั้งแรกที่แนะนำตามเป้าหมายกำไร"',
        'vi': '"Kích Thước Entry Đầu Tiên Khuyến Nghị theo Mục Tiêu Lợi Nhuận"',
        'tr': '"Hedef Kâra Göre Önerilen 1. Giriş Boyutu"',
    },
    '"Target Profit Rate (%)"': {
        'id': '"Target Profit Rate (%)"',
        'th': '"อัตราผลกำไรเป้าหมาย (%)"',
        'vi': '"Tỷ Lệ Lợi Nhuận Mục Tiêu (%)"',
        'tr': '"Hedef Kâr Oranı (%)"',
    },
    # Step 6
    '"Advanced Controls — Feature Details"': {
        'id': '"Kontrol Lanjutan — Detail Fitur"',
        'th': '"การควบคุมขั้นสูง — รายละเอียดคุณสมบัติ"',
        'vi': '"Kiểm Soát Nâng Cao — Chi Tiết Tính Năng"',
        'tr': '"Gelişmiş Kontroller — Özellik Detayları"',
    },
    '"Nth Entry Reset"': {
        'id': '"Reset Entry Ke-N"',
        'th': '"รีเซ็ตการเข้าครั้งที่ N"',
        'vi': '"Đặt Lại Entry Thứ N"',
        'tr': '"N. Giriş Sıfırlama"',
    },
    '"Trend-Only Mode"': {
        'id': '"Mode Hanya Tren"',
        'th': '"โหมดเทรนด์เท่านั้น"',
        'vi': '"Chế Độ Chỉ Xu Hướng"',
        'tr': '"Sadece Trend Modu"',
    },
    '"Fibonacci Swap"': {
        'id': '"Fibonacci Swap"',
        'th': '"Fibonacci Swap"',
        'vi': '"Fibonacci Swap"',
        'tr': '"Fibonacci Swap"',
    },
    '"Max Loss Limit"': {
        'id': '"Batas Kerugian Maksimum"',
        'th': '"ขีดจำกัดการขาดทุนสูงสุด"',
        'vi': '"Giới Hạn Lỗ Tối Đa"',
        'tr': '"Maksimum Kayıp Limiti"',
    },
    '"Long / Short Mode"': {
        'id': '"Mode Long / Short"',
        'th': '"โหมด Long / Short"',
        'vi': '"Chế Độ Long / Short"',
        'tr': '"Long / Short Modu"',
    },
    '"Golden X Rotation"': {
        'id': '"Rotasi Golden X"',
        'th': '"การหมุนเวียน Golden X"',
        'vi': '"Luân Chuyển Golden X"',
        'tr': '"Altın X Rotasyonu"',
    },
    '"Take-Profit Rules (On Full Exit)"': {
        'id': '"Aturan Take-Profit (Saat Keluar Penuh)"',
        'th': '"กฎการทำกำไร (เมื่อออกเต็มจำนวน)"',
        'vi': '"Quy Tắc Take-Profit (Khi Thoát Hoàn Toàn)"',
        'tr': '"Kar Al Kuralları (Tam Çıkışta)"',
    },
}

def add_language_translations_to_file(filepath, is_server=True):
    """Read file and add translations for blocks with only 6 languages."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    translations = SERVER_TRANSLATIONS if is_server else STRATEGY_TRANSLATIONS
    
    for en_text, new_langs in translations.items():
        # Look for patterns like: en: "...", followed by 5 other language entries, ending with es: "...",
        # and add the 4 new languages
        
        # This is a simplified approach - for complex multi-line strings, 
        # we'd need more sophisticated parsing
        for lang_code, translation in new_langs.items():
            # Check if this translation already exists
            if f'{lang_code}: {translation}' not in content:
                # Find the es: line and add after it
                pass  # Complex regex needed here
    
    return content

if __name__ == "__main__":
    print("This script provides translation mappings for manual editing.")
    print("Use the Edit tool to add translations block by block.")
