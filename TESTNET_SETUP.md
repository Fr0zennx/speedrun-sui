## 🚀 Testnet Ortamı Kurulum Tamamlandı!

Ortamınız başarıyla hazırlandı. İşte sıradaki adımlar:

### ✅ Tamamlanan Adımlar:

1. ✓ **Sui CLI** kontrol edildi (v1.57.2)
2. ✓ **Testnet** aktif şekilde yapılandırıldı
3. ✓ **Node.js** dependencies yüklendi
4. ✓ **Move paketi** derlendi (uyarısız)
5. ✓ **Frontend .env** dosyası oluşturuldu

---

### 📝 Sonraki Adımlar:

#### 1. **Move Paketini Deploy Etme**

```powershell
# Testnet'e deploy et
sui client publish --gas-budget 100000000
```

Deploy olduktan sonra, output'tan **PackageID** değerini kopyalayın.

#### 2. **Package ID'yi Güncelleme**

`frontend/.env.local` dosyasını açıp, `VITE_PACKAGE_ID` değerini değiştirin:

```
VITE_PACKAGE_ID=0x[deploy_edilen_package_id]
```

#### 3. **Frontend'i Çalıştırma**

```powershell
cd frontend
npm run dev
```

Frontend `http://localhost:5173` adresinde açılacak.

#### 4. **Sui Wallet Bağlama**

1. Browser'da Sui Wallet extension'ını açın
2. Testnet seçin
3. **Connect Wallet** butonuna tıklayın
4. İstenen işlemleri onaylayın

---

### 🔧 Yararlı Komutlar:

```powershell
# Aktif adresi kontrol et
sui client active-address

# Move paketini tekrar derle
sui move build

# Testnet gas durumunu kontrol et
sui client gas

# Önceki transactionları görüntüle
sui client tx-list
```

---

### 📚 Faydalı Linkler:

- **Sui Docs**: https://docs.sui.io
- **Sui Testnet**: https://suiscan.xyz/testnet
- **Sui TypeScript SDK**: https://github.com/MystenLabs/sui/tree/main/sdk/typescript
- **Move Language**: https://move-language.github.io/move/

---

### ⚠️ Önemli Notlar:

- **Gas Budget**: Deploy için başlangıçta 100000000 gas yeterlidir
- **Test SUI**: Testnet'de ücretsiz SUI almak için: https://discord.gg/sui
- **Cüzdan**: Sui Wallet, Mystens veya Leap Wallet kullanabilirsiniz

Hazır mısınız? Deploy etmeye başlayabilirsiniz! 🎯
