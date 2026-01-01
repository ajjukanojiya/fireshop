// Shop Configuration File
// This ensures the software can be used by any shopkeeper by simply changing these values.

export const shopConfig = {
    // Basic Details
    shopName: "FireShop",
    city: "Jabalpur",
    state: "Madhya Pradesh",

    // Compliance & Safety
    minAge: 18,
    maxDeliveryRange: "30km", // Display text

    // Allowed Pincodes for Delivery (Strict Whitelist)
    // Add more pincodes here to expand service area
    allowedPincodes: [
        "482001", "482002", "482003", "482004", "482005",
        "482006", "482007", "482008", "482009", "482010"
    ],

    // Terminology Overrides (For Legal Safety)
    terms: {
        buyButton: "Book Delivery",
        cartTitle: "My Booking List",
        checkoutTitle: "Confirm Booking",
        priceLabel: "Est. Price"
    }
};

export const checkPincode = (pincode) => {
    if (!pincode) return false;
    return shopConfig.allowedPincodes.includes(pincode.toString().trim());
};
