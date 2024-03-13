const express = require("express");
const mysql = require("mysql");
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bikeshop",
});

db.connect(err => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log("Database Connected!");
}); 

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

/**
 * PRODUTOS
 */

// LISTA DE TODOS OS PRODUTOS
app.get("/products", (req, res) =>{
    let sql = "SELECT * FROM produto";
    db.query(sql, (err, results)=>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

//DETALHES DE 1 SO PRODUTO QUE O ID=?
app.get("/products/:id", (req, res) =>{
    let sql = `SELECT * FROM produto WHERE id_produto = ${req.params.id}`;
    db.query(sql, (err, results)=>{
        if (err) {
            throw err;
        }
        res.send(results[0]);
    });
});

//DETALHES DE 1 SO PRODUTO QUE O IDCategoria=?
app.get("/productsByCategorie/:idcategoria", (req, res) =>{
    let sql = `SELECT * FROM produto WHERE idcategoria = ${req.params.idcategoria}`;
    db.query(sql, (err, results)=>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

//ADICIONAR 1 PRODUTO
app.post("/products", (req, res) =>{
    let sql = "INSERT INTO produto SET ?";
    db.query(sql, req.body, err => {
        if (err) {
            throw err;
        }
        res.send(req.body);
    });
});

//ELIMINAR PRODUTO
app.delete("/products", (req, res) =>{
    let sql = `DELETE FROM produto WHERE id_produto = ${req.query.id}`;
    db.query(sql, req.body, err => {
        if (err) {
            throw err;
        }
        res.status(200).send(`Deleted product ${req.query.id}`);
    });
});

//EDITAR PRODUTO
app.put("/products", (req, res) =>{
    let sql = `UPDATE produto SET ? WHERE id_produto = ${req.query.id}`;
    db.query(sql, req.body, err => {
        if (err) {
            throw err;
        }
        res.status(200).send(`UPDATED product ${req.query.id}`);
    });
});

/**
 * CATEGORIA
 */

//ADICIONAR CATEGORIA
app.post("/categorie", (req, res) =>{
    let sql = `INSERT INTO categoria SET ?`;
    db.query(sql, req.body, err => {
        if (err) {
            throw err;
        }
        res.send(req.body);
    });
});

//DETALHES DE TODAS AS CATEGORIAS   
app.get("/categorie", (req, res) =>{
    let sql = `SELECT * FROM categoria`;
    db.query(sql, (err, results) =>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

//DETALHES CATEGORIA POR ID
app.get("/categorie/:id", (req, res) =>{
    let sql = `SELECT * FROM categoria WHERE idcategoria = ${req.params.id}`;
    db.query(sql, (err, results) =>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

//DETALHES CATEGORIA POR ID MASTER
app.get("/categorieMaster/", (req, res) =>{
    let masters = "SELECT * FROM master_categoria"
    db.query(masters, (err, results) =>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

//EDITAR CATEGORIA
app.put("/categorie", (req, res) =>{
    let sql = `UPDATE categoria SET ? WHERE idcategoria = ${req.query.id}`;
    db.query(sql, req.body, err =>{
        if(err){
            throw err;
        }
        res.status(200).send(`UPDATED categorie ${req.query.id}`);
    });
});

//ELIMINAR CATEGORIA
app.delete("/categorie", (req, res) =>{
    let sql = `DELETE * FROM categoria WHERE idcategoria = ${req.query.id}`;
    db.query(sql, req.body, err=>{
        if(err){
            throw err;
        }
        res.status(200).send(`Deleted categorie ${req.query.id}`);
    });
});

/**
 * UTILIZADOR
 */

//CRIAR CONTA

app.post("/user", (req, res) =>{
    let sql = `INSERT INTO utilizador(email_utilizador, password_utilizador, nome_utilizador, apelido_utilizador) SET (?,?,?,?)`;
    db.query(sql, req.body, err =>{
        if(err){
            throw err;
        }
        res.send(req.body);
    });
});

//DETALHES CONTA
app.get("/user", (req, res) =>{
    let sql = `SELECT * FROM utilizador`;
    db.query(sql, (err, results) =>{
        if(err){
            throw err;
        }
        res.send(results);
    });
});

//DETALHES DE 1 SO CONTA
app.get("/user/:id", (req, res) =>{
    let sql = `SELECT * FROM utilizador WHERE id_utilizador = ${req.params.id}`;
    db.query(sql, (err, results)=>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

app.get("/userCart/:id", (req, res) =>{
    let sql = `SELECT * FROM utilizador WHERE idcarrinho = ${req.params.id}`;
    db.query(sql, (err, results)=>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

//EDITAR CONTA
app.put("/user", (req, res) =>{
    let sql = `UPDATE utilizador SET ? WHERE id_utilizador = ${req.query.id}`;
    db.query(sql, req.body, err =>{
        if(err){
            throw err;
        }
        res.status(200).send(`UPDATED user ${req.query.id}`);
    });
});

//ELIMINAR CONTA
app.delete("/user", (req, res) =>{
    let sql = `DELETE * FROM utilizador WHERE id_utilizador = ${req.query.id}`;
    db.query(sql, req.body ,err =>{
        if(err){
            throw err;
        }
        res.status(200).send(`DELETED USER ${req.query.id}`);
    });
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { email, password, nome, apelido } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    
  
    const carrinhosql = 'INSERT INTO carrinho (quantidade_produto_total) VALUES (?)'
    const sql = 'INSERT INTO utilizador (email, password, nome, apelido, idcarrinho) VALUES (?, ?, ?, ?, ?)';

    db.query(carrinhosql, [0], (err, result) => {
        if (err) {
            console.log(err);
          res.status(500).json({ error: 'Registration failed' });
        } else {
            console.log(result.insertId);
          db.query(sql, [email, hashedPassword, nome, apelido, result.insertId], (err, result) => {
            if (err) {
              res.status(500).json({ error: 'Registration failed' });
              console.log(err);
            } else {
              res.send(result)
            }
          });
        }
    });


  });

  app.post('/login', (req, res) => {
    const { email, password} = req.body;
  
    const sql = 'SELECT * FROM utilizador WHERE email = ?';
    db.query(sql, [email], (err, result) => {
      if (err || result.length === 0) {
        res.status(401).json({ error: 'Invalid username or password' });
      } else {
        const user = result[0];
        const passwordMatch = bcrypt.compareSync(password, user.password);
  
        if (passwordMatch) {
          const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
          res.status(200).json({ token, user });
        } else {
          res.status(401).json({ error: 'Invalid username or password' });
        }
      }
    });
  });

/**
 * ADMINS
 */

//ADICONAR ADMINS
app.post("/admins", (req, res) =>{
    let sql = `INSERT INTO administradores SET ?`;
    db.query(sql, (err, results) =>{
        if(err){
            throw err;
        }
        res.send(results);
    });
});

//EDITAR ADMINS
app.put("/admins", (req, res) =>{
    let sql = `UPDATE administradores SET ? WHERE idAdministradores = ${req.query.id}`;
    db.query(sql, req.body, err => {
        if(err){
            throw err;
        }
        res.status(200).send(`UPDATED ADMIN ${req.query.id}`);
    });
});

//DETALHES ADMINS
app.get("/admins", (req, res)=>{
    let sql = `SELECT * FROM administradores WHERE idAdministradores = ${req.query.id}`;
    db.query(sql, req.body, err =>{
        if(err){
            throw err;
        }
        res.send(req.body);
    });
});

//ELIMINAR ADMINS
app.delete("/admins", (req, res)=>{
    let sql = `DELETE * FROM administradores WHERE idAdministradores = ${req.query.id}`;
    db.query(sql, req.body, err =>{
        if(err){
            throw err;
        }
        res.status(200).send(`DELETED ADMIN ${req.query.id}`);
    })
})

/**
 * CARRINHO
 */
app.post("/shoppingcart", (req, res)=>{
    let sql = `INSERT INTO carrinho SET ?`;
    db.query(sql, (err, results)=>{
        if(err){
            throw err;
        }
        res.send(results);
    })
})
app.put("/shoppingcart", (req, res)=>{
    let sql = `UPDATE carrinho SET ? WHERE idcarrinho = ${req.query.id}`;
    db.query(sql, req.body, err => {
        if(err){
            throw err;
        }
        res.status(200).send(`UPDATED CARRINHO ${req.query,id}`);
    })
})

app.get("/shoppingcart", (req, res)=>{
    let sql = `SELECT * FROM carrinho`;
    db.query(sql, req.body, err =>{
        if(err){
            throw err;
        }
        res.send(req.body);
    })
})

app.get("/shoppingcart/:id", (req, res)=>{
    let sql = `SELECT * FROM carrinho WHERE idcarrinho = ${req.query.id}`;
    db.query(sql, req.body, err =>{
        if(err){
            throw err;
        }
        res.send(req.body);
    })
})

app.post("/removeFromCart", (req, res)=>{
    let sql = `DELETE FROM carrinho_has_produto WHERE id_produto =${req.body.id_produto} AND idcarrinho =${req.body.idcarrinho} LIMIT 1`;
    db.query(sql, (err, results)=>{
        if(err){
            throw err;
        }
        res.send(results);
    })
})

app.delete("/shoppingcart", (req, res) =>{
    let sql = `DELETE * FROM carrinho WHERE idcarrinho = ${req.query.id}`;
    db.query(sql, req.body, err=>{
        if(err){
            throw err;
        }
        res.status(200).send(`DELETED CARRINHO ${req.query.id}`);
    })
})

app.post("/carrinhoProduto", (req, res)=>{
    let sql = `INSERT INTO carrinho_has_produto (quantidade_produto, id_produto, idcarrinho) VALUES (?, ?, ?)`;
    db.query(sql, [req.body.quantidade_produto, req.body.id_produto, req.body.id_carrinho] , (err, results)=>{
        if(err){
            throw err;
        }
        res.send(results);
    })
})

app.get("/carrinhoProduto/:id", (req, res)=>{
    let sql = `SELECT 
    p.id_produto,
    p.nome_produto,
    p.preco_produto,
    cp.quantidade_produto,
    (p.preco_produto * cp.quantidade_produto) AS subtotal
FROM 
    carrinho c
JOIN 
    carrinho_has_produto cp ON c.idcarrinho = cp.idcarrinho
JOIN 
    produto p ON cp.id_produto = p.id_produto
WHERE 
    c.idcarrinho = ${req.params.id}`;
    db.query(sql, (err, results)=>{
        if(err){
            throw err;
        }
        res.send(results);
    })
})




/**
 * ENCOMENDA
 */

app.post("/order", (req, res) =>{
    let sql = `INSERT INTO encomenda (first_name, last_name, morada, zip_code, cidade, pais, contacto, id_utilizador, idcarrinho) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )`;
    db.query(sql, [req.body.nome, req.body.sobrenome, req.body.morada, req.body.postal, req.body.cidade, req.body.pais, req.body.contacto, req.body.id_utilizador, req.body.idcarrinho], (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

app.get("/order", (req, res) =>{
    let sql = `SELECT * FROM encomenda`;
    db.query(sql, (err, results) =>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

app.get("/order/:id", (req, res) =>{
    let sql = `SELECT * FROM encomenda WHERE idEncomenda = ${req.params.id}`;
    db.query(sql, (err, results) =>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

app.get("/orderByUser/:id", (req, res) =>{
    let sql = `SELECT * FROM categoria WHERE id_utlizador = ${req.params.id}`;
    db.query(sql, (err, results) =>{
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

app.put("/order", (req, res) =>{
    let sql = `UPDATE encomenda SET ? WHERE idEncomenda = ${req.query.id}`;
    db.query(sql, req.body, err =>{
        if(err){
            throw err;
        }
        res.status(200).send(`UPDATED order ${req.query.id}`);
    });
});

app.delete("/order", (req, res) =>{
    let sql = `DELETE * FROM order WHERE idEncomenda = ${req.query.id}`;
    db.query(sql, req.body, err=>{
        if(err){
            throw err;
        }
        res.status(200).send(`DELETED encomenda ${req.query.id}`);
    })
})


app.listen(PORT, ()=>{
    console.log("Server started on port 3000");
});