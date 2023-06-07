import banner_cart from '../assets/Images/banner_cart.svg'
import banner_chat from '../assets/Images/banner_chat.svg'
import banner_delivery from '../assets/Images/banner_delivery.svg'
import banner_gift from '../assets/Images/banner_gift.svg'


export default function Banner() {
    const incentives = [
        {
            name: 'Free Shipping',
            description: "It's not actually free we just price it into the products. Someone's paying for it, and it's not us.",
            imageSrc: banner_cart,
        },
        {
            name: '24/7 Customer Support',
            description: "We provide multiple ways to contact us, including email, phone, and our support team is always ready to help you.",
            imageSrc: banner_chat,
        },
        {
            name: 'Fast Shopping Cart',
            description: "Look how fast that cart is going. What does this mean for the actual experience? I don't know.",
            imageSrc: banner_delivery,
        },
        {
            name: 'Gift Cards',
            description: "Buy them for your friends, especially if they don't like our store. Free money for us, it's great.",
            imageSrc: banner_gift,
        },
    ]
    return (
        <div className="bg-gray-50">
            <div className="max-w-2xl mx-auto py-24 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:px-8">
                <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
                    {incentives.map((incentive) => (
                        <div key={incentive.name}>
                            <img src={incentive.imageSrc} alt="" className="h-24 w-auto mx-auto " />
                            <h3 className="mt-6 text-sm font-medium text-gray-900">{incentive.name}</h3>
                            <p className="mt-2 text-sm text-gray-500">{incentive.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
