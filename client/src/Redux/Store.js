import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./Slices/AuthSlice";
import CategorySlice from "./Slices/CategorySlice";
import ProductSlice from "./Slices/ProductSlice";
import Couponslice from "./Slices/CouponSlice";
import SliderSlice from "./Slices/SliderSlice";
import AdminOrderSlice from "./Slices/AdminOrderSlice";
import UserSlice from "./Slices/UserSlice";
import SettingSlice from "./Slices/SettingSlice";
import CartSlice from "./Slices/CartSlice";
import WishlistSlice from "./Slices/WishlistSlice";
import RatingSlice from "./Slices/RatingSlice";
import EmailSlice from "./Slices/EmailSlice";

const store = configureStore({
  reducer: {
    Auth: AuthSlice,
    Category: CategorySlice,
    Product: ProductSlice,
    Coupon: Couponslice,
    Slider: SliderSlice,
    Order: AdminOrderSlice,
    User: UserSlice,
    Setting: SettingSlice,
    Cart: CartSlice,
    Wishlist: WishlistSlice,
    Rating: RatingSlice,
    Email: EmailSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
