import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";


const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Geçici veri deposu
let posts = [];
let postIdCounter = 1;

// ROUTES

// Anasayfa – Yazı listesi
app.get("/", (req, res) => {
  const message = req.query.message;
  res.render("index", { posts: posts, message: message });
});

// Arama İşlemi
app.get("/search", (req, res) => {
  const query = req.query.q.toLowerCase();
  const filteredPosts = posts.filter(post => post.title.toLowerCase().includes(query));

  res.render("search", { query: req.query.q, posts: filteredPosts });
});



// Yazı oluşturma formu
app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

// Yazı gönderimi,post ekleme
app.post("/compose", (req, res) => {
  const post = {
    id: postIdCounter++,
    title: req.body.postTitle,
    content: req.body.postContent,
    category: req.body.postCategory,
    date: new Date().toLocaleString("tr-TR")
  };
  posts.push(post);
  res.redirect("/?message=Post eklendi!");

});

// Tekil yazı sayfası,post ekleme
app.get("/posts/:postId", (req, res) => {
  const requestedId = parseInt(req.params.postId);
  const post = posts.find(p => p.id === requestedId);

  if (post) {
    res.render("post", { post: post });
  } else {
    res.status(404).send("Post not found!");
  }
});

//kategori işlemleri
app.get("/category/:categoryName", (req, res) => {
  const categoryName = req.params.categoryName;
  const filteredPosts = posts.filter(
    post => post.category.toLowerCase() === categoryName.toLowerCase()
  );
  res.render("category", { category: categoryName, posts: filteredPosts });
});


//post düzenlerken gerekli get ve post işlemleri
app.get("/edit/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find(p => p.id === postId);
  if (post) {
    res.render("edit", { post: post });
  } else {
    res.status(404).send("Post not found!");
  }
});

app.post("/edit/:postId", (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = posts.find(p => p.id === postId);

  if (post) {
    post.title = req.body.title;
    post.content = req.body.content;
    res.redirect("/?message=Post başarıyla güncellendi!");
  } else {
    res.status(404).send("Post not found!");
  }
});


//post silerken lazım
app.post("/delete", (req, res) => {
    const postId = parseInt(req.body.postId);
    posts = posts.filter(post => post.id !== postId);
    res.redirect("/?message=Post başarıyla silindi!");
  });


//sidebarların kullanımı
app.get("/dashboard", (req, res) => {
  const totalPosts = posts.length;
  let lastPostTitle = "-";
  let lastPostDate = "-";
  let last3Posts = [];

  if (posts.length > 0) {
    const lastPost = posts[posts.length - 1];
    lastPostTitle = lastPost.title;
    lastPostDate = lastPost.date;

    // En son 3 postu al (ters sırada)
    last3Posts = posts.slice(-3).reverse();
  }

  res.render("dashboard", {
    totalPosts,
    lastPostTitle,
    lastPostDate,
    last3Posts // Bunu eklemezsek ejs patlar 😄
  });
});

app.get("/events", (req, res) => {
  res.render("events");
});

  
app.get("/account", (req, res) => {
  res.render("account");
});

app.get("/about", (req, res) => {
  res.render("about");
});

  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
