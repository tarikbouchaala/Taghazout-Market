
export default function CollectionSection() {
    return (
        <div className="bg-white py-16">
            <div className="container mx-auto flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4">Our Collections</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Collection 1"
                            className="mb-2"
                        />
                        <h3 className="text-xl font-bold">Collection 1</h3>
                        <p className="text-gray-700">
                            Browse our collection of high-quality products.
                        </p>
                    </div>
                    <div className="p-4">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Collection 2"
                            className="mb-2"
                        />
                        <h3 className="text-xl font-bold">Collection 2</h3>
                        <p className="text-gray-700">
                            Discover the latest trends in fashion.
                        </p>
                    </div>
                    <div className="p-4">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Collection 3"
                            className="mb-2"
                        />
                        <h3 className="text-xl font-bold">Collection 3</h3>
                        <p className="text-gray-700">
                            Find the perfect gift for your loved ones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}