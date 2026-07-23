// ===============================
// NSS Utility Functions
// ===============================

export function getProfileImage(profession) {

    if (!profession) {
        return "images/placeholders/default.png";
    }

    const p = profession.toLowerCase();

    if (p.includes("electric")) return "images/placeholders/electrician.png";

    if (p.includes("plumb")) return "images/placeholders/plumber.png";

    if (p.includes("mason")) return "images/placeholders/mason.png";

    if (p.includes("ac")) return "images/placeholders/ac-technician.png";

    if (p.includes("refrigerator") || p.includes("fridge"))
        return "images/placeholders/refrigerator-technician.png";

    if (p.includes("mobile"))
        return "images/placeholders/mobile-technician.png";

    if (p.includes("computer"))
        return "images/placeholders/computer-technician.png";

    if (p.includes("carpenter"))
        return "images/placeholders/carpenter.png";

    if (p.includes("painter"))
        return "images/placeholders/painter.png";

    if (p.includes("welder"))
        return "images/placeholders/welder.png";

    if (p.includes("driver"))
        return "images/placeholders/driver.png";

    if (p.includes("beaut"))
        return "images/placeholders/beauty.png";

    if (p.includes("tailor"))
        return "images/placeholders/tailor.png";

    if (p.includes("clean"))
        return "images/placeholders/cleaner.png";

    return "images/placeholders/default.png";

}