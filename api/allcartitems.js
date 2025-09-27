export default async function handler(req, res) {
  try {
    const response = await fetch("https://freeapi.miniprojectideas.com/api/amazon/GetAllCartItems"); 
    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
}
