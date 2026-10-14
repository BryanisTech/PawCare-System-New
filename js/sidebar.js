
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();

    const sidebarLinks = document.querySelectorAll(".sidebar-link");

    sidebarLinks.forEach((link) => {
        const linkPage = link.getAttribute("href").split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add(
                "bg-pink-100",
                "font-semibold",
                "text-pink-700"
            );

            link.classList.remove("text-gray-600");
        } else {
            link.classList.remove(
                "bg-pink-100",
                "font-semibold",
                "text-pink-700"
            );

            link.classList.add("text-gray-600");
        }
    });
});
