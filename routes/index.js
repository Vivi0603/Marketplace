const userRoutes = require('./user');
const productRoutes = require('./product');
const cartRoutes = require('./cart');

const routes = (app) => {
    app.use('/',userRoutes)
    app.use('/user', userRoutes);
    app.use('/product', productRoutes);
    app.use('/cart', cartRoutes);

    app.use('*', (req, res) => {
        res.status(404).render("posts/error",{ error: ' URL Not found' });
    });
};
module.exports = routes;