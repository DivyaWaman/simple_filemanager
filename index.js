const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    fs.readdir('./files', function (err, files) {
        console.log(files);
        res.render("index", { files: files });
    })
})

app.get("/file/:filename", function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function (err, data) {
        res.render("show", { title: req.params.filename, fileData: data });
    });
});

app.post("/create", function (req, res) {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.detail, function (err) {
        if (err) throw err;
        res.redirect("/");
    });
})

app.get("/edit/:filename", function (req, res) {
    res.render("edit", { title: req.params.filename });
});

app.post("/edit", function (req, res) {
    console.log(req.body);
    const oldPath = `./files/${req.body.previous}`;
    const newPath = `./files/${req.body.new.split(' ').join('')}.txt`;
    fs.access(oldPath, fs.constants.F_OK, function (err) {
        if (err) {
            return res.status(404).send("File not found");
        }
        fs.rename(oldPath, newPath, function (err) {
            res.redirect("/");
        });
    })

});

app.get("/delete/:filename", function (req, res) {
    const filePath = `./files/${req.params.filename}`;
    fs.access(filePath, fs.constants.F_OK, function (err) {
        if (err) {
            return res.status(404).send("File not found");
        }
        fs.unlink(filePath, function (err) {
            if (err) {
                return res.status(500).send("Error deleting file");
            }
            res.redirect("/");
        })
    })
})

app.listen(3000, function () {
    console.log("Server is running.....");
})