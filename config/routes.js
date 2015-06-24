var routes = require('../routes/index');
var users = require('../routes/users');
var countries = require('../routes/countries');
var cities = require('../routes/cities');
var status = require('../routes/status');
var profiles = require('../routes/profiles');
var adminRoutes = require('../routes/admin/index');
var adminUsers = require('../routes/admin/users');

app.use('/admin', adminRoutes);
app.use('/admin', adminUsers);
app.use('/', routes);
app.use('/', users);
app.use('/', countries);
app.use('/', cities);
app.use('/', status);
app.use('/', profiles);