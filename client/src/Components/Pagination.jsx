
export default function Pagination({ productsPerPage, paginate, totalProducts, indexOfLastProduct, indexOfFirstProduct, productsNumber, currentPage }) {
    const maxVisiblePages = 3;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    let start;
    let end;

    if (totalPages <= maxVisiblePages) {
        start = 1;
        end = totalPages;
    } else {
        if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
            start = 1;
            end = maxVisiblePages;
        } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
            start = totalPages - maxVisiblePages + 1;
            end = totalPages;
        } else {
            start = currentPage - Math.floor(maxVisiblePages / 2);
            end = currentPage + Math.ceil(maxVisiblePages / 2) - 1;
        }
    }

    const pageLinks = [];

    if (start > 1) {
        pageLinks.push(
            <div
                key="ellipsis-start"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => paginate(1)}
            >
                1
            </div>
        );

        if (start > 2) {
            pageLinks.push(
                <div key="ellipsis-dots-start" className="px-2 py-2 text-sm font-semibold text-gray-900">
                    ...
                </div>
            );
        }
    }

    for (let i = start; i <= end; i++) {
        const isCurrentPage = i === currentPage;
        const isFirstPage = i === 1;
        const isLastPage = i === totalPages;

        pageLinks.push(
            <div
                key={i}
                onClick={() => paginate(i)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${isCurrentPage ? "bg-gradient-to-r from-red-500 to-yellow-400 " : ""
                    }${isFirstPage && "rounded-tl-lg rounded-bl-lg "}${isLastPage && " rounded-tr-lg rounded-br-lg "}`}
            >
                {i}
            </div>
        );
    }


    if (end < totalPages) {
        if (end < totalPages - 1) {
            pageLinks.push(
                <div key="ellipsis-dots-end" className="px-2 py-2 text-sm font-semibold text-gray-900">
                    ...
                </div>
            );
        }

        pageLinks.push(
            <div
                key="ellipsis-end"
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                onClick={() => paginate(totalPages)}
            >
                {totalPages}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-5">
            <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing
                        <span className="font-medium"> {indexOfFirstProduct + 1} </span>
                        to
                        <span className="font-medium"> {Math.min(indexOfLastProduct, productsNumber)} </span>
                        of
                        <span className="font-medium"> {productsNumber} </span>
                        results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px shadow-sm" aria-label="Pagination">
                        {pageLinks}
                    </nav>
                </div>
            </div>
        </div>
    );
}
