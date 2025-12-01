import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
const start = async () => {
    try {
        await connectDB();
        app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map