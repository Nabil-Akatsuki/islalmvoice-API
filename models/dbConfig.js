const mongoose = require('mongoose');
mongoose.connect(
    "mongodb+srv://Nabil:12345678Mo@islam-cluster.4oqmr.mongodb.net/userData?retryWrites=true&w=majority",
    { useNewUrlParser: true,useUnifiedTopology: true },
    (err) => { err === null? console.log('Connexion reussie à mongoose') : console.log('Connexion échouée'+err) }

)