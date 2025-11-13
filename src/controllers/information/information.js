import { conn } from "../../utils/db.js";

export const getBanners = async (req, res) => {
    try {
        const [banners] = await conn.execute(
            'SELECT banner_name, banner_image, description FROM banners'
        );
        res.status(200).json({
            status: 0,
            message: "Sukses",
            data: banners
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
}

export const getServices = async (req, res) => {
    try {
        const [services] = await conn.execute(
            'SELECT service_code, service_name, service_icon, service_tariff FROM services'
        );
        res.status(200).json({
            status: 0,
            message: "Sukses",
            data: services
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: "Internal server error"
        });
    }
}