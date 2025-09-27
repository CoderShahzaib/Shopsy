export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    const response = await fetch(
      `https://freeapi.miniprojectideas.com/api/amazon/DeleteProductFromCartById?id=${id}`
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching category",
      error: error.message,
    });
  }
}
