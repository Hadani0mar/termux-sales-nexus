
import React, { useState } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import CartItemCard from "@/components/CartItemCard";
import CheckoutForm from "@/components/CheckoutForm";
import { useAppContext } from "@/contexts/AppContext";
import { formatCurrency, calculateCartTotal, generateReceipt } from "@/utils/helpers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, ShoppingCart, ReceiptText, Filter } from "lucide-react";
import { Settings, defaultSettings } from "@/types/settings";
import { Badge } from "@/components/ui/badge";

const POS = () => {
  const { 
    state, 
    addToCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    addSale 
  } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get settings from localStorage
  const savedSettings = localStorage.getItem("settings");
  const settings: Settings = savedSettings 
    ? JSON.parse(savedSettings)
    : defaultSettings;
  
  // البحث وفلترة المنتجات حسب الفئة
  const filteredProducts = state.products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode?.includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    // إذا كان هناك فئة محددة، قم بتصفية المنتجات وفقًا لها
    if (selectedCategory) {
      return matchesSearch && product.category === selectedCategory;
    }
    
    return matchesSearch;
  });
  
  // حساب إجمالي السلة
  const cartTotal = calculateCartTotal(state.cart);
  const itemCount = state.cart.reduce((count, item) => count + item.quantity, 0);
  
  // إضافة منتج إلى السلة مع الكمية الافتراضية 1
  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
  };
  
  // إتمام الطلب وإنشاء فاتورة
  const handleCheckout = (saleData: any) => {
    // إضافة البيع إلى قاعدة البيانات
    addSale(saleData);
    
    // إنشاء وطباعة الفاتورة
    generateReceipt(
      { ...saleData, id: "temp", createdAt: new Date() },
      settings.businessName,
      settings.receiptFooter
    );
    
    // إغلاق نافذة الدفع
    setCheckoutOpen(false);
  };
  
  return (
    <Layout>
      <div className="layout-container">
        {/* قسم المنتجات */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="relative mb-4">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>
            
            {/* فلتر الفئات */}
            <ScrollArea className="whitespace-nowrap pb-2">
              <div className="flex gap-2 rt">
                <Badge 
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                >
                  الكل
                </Badge>
                {settings.categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category.name)}
                    style={category.color ? { backgroundColor: selectedCategory === category.name ? category.color : 'transparent', borderColor: category.color, color: selectedCategory === category.name ? 'white' : category.color } : {}}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <ScrollArea className="h-[calc(100vh-14rem)]">
            <div className="p-4">
              {filteredProducts.length > 0 ? (
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">لا توجد منتجات متطابقة مع البحث</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* قسم السلة */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col">
          <div className="p-4 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold flex items-center dark:text-white">
              <ShoppingCart className="ml-2" />
              سلة المشتريات
              {itemCount > 0 && (
                <span className="mr-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                  {itemCount}
                </span>
              )}
            </h2>
          </div>
          
          {state.cart.length > 0 ? (
            <>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  {state.cart.map((item) => (
                    <CartItemCard
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={updateCartItem}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              </ScrollArea>
              
              <div className="border-t dark:border-gray-700 p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold dark:text-white">المجموع:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 dark:text-white dark:hover:bg-gray-700"
                    onClick={() => clearCart()}
                  >
                    تفريغ
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => setCheckoutOpen(true)}
                  >
                    <ReceiptText className="ml-2 w-4 h-4" />
                    الدفع
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">السلة فارغة</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* نموذج إتمام البيع */}
      <CheckoutForm
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={state.cart}
        onCheckout={handleCheckout}
      />
    </Layout>
  );
};

export default POS;
