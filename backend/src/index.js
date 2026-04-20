import { connectDB } from "./db/mongodb.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((err) => {
    console.log(`MongoDB connection error:`, err);
})
