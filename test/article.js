const app = require('../index');
const chai = require('chai');
const {expect} = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
require('dotenv/config');

chai.use(chaiHttp);
let token = "";
let articleId;
const fakeArticleId = '626adf8d238095ceb9b6000'


describe("POST API /users", () =>{
    beforeEach(()=>{
        mongoose.connection.dropCollection("users");
    })

    const user = {
        name:"Tuyisenge Samuel",
        email:"tuyisengesamy6@gmail.com",
        password:"semytuyi",
        role:"admin"
    };
    const users = {
        name:"Tuyisenge Samuel",
        email:"tuyisengesamy6@gmail.com",
        password:"semytuyi",
        role:"subscriber"
    };

    it("should successfully create an account and return 200", (done) => {
        chai.request(app)
            .post("/users")
            .send(user)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.status).to.equal(200);
                return done();
            });
            
    });
});



describe("POST API /users/login", () => {
    /*afterEach(()=>{
        mongoose.connection.dropCollection("users")
    })*/

    const user = {
        email: "tuyisengesamy6@gmail.com",
        password: "semytuyi"
    };

    const user1 = {
        email: "tuyisengesamy@gmail.com",
        password: "semysamy"
    };

    it("it should successfully login and return 200", (done) => {
        chai.request(app)
            .post("/users/login")
            .send(user)
            .end((err, res) => {
                if(err) return done(err);
                token = res.body.token;
                expect(res.status).to.be.equal(200);
                expect(res.body).to.have.property("token");
                return done();
            });
    });
    
    describe("POST API  /article", () => {

        const article = {
            title: "WIN OR LOSE",
            authorName: "samuel",
            content: "win or lose atleast you are doing something"
        };
    
        it("it must create article and return 200", (done) => {

           chai.request(app)
                .post("/article")
                .set('Authorization',`Bearer ${token}`)
                .send(article)
                .end((err, res) => {
                    if(err) return done(err);
                    articleId = res.body._id;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("object");
                    expect(res.body).to.have.property("title");
                    expect(res.body).to.have.property("authorName");
                    expect(res.body).to.have.property("content");
                    return done();
                })
    
        });
    });

    describe("GET API  /article", () => {
        it('must return all articles', (done) => {
            chai.request(app)
                .get("/article")
                .send()
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    return done();
                });
        });
    });

    describe("GET API /article/{id}", () => {
        it("must return article based on its id", (done) => {
            chai.request(app)
                .get(`/article/${articleId}`)
                .send()
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.a('object');
                    return done();
                });
        });

        it("must return 404 when article doesn't exist", (done) => {
            chai.request(app)
                .get(`/article/${fakeArticleId}`)
                .send()
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res.status).to.equal(404);
                   
                    return done();
                });
        });
    });

    describe("PATCH API /article/{id}/update", () => {
        const updatedArticle = {
            title: "Nothing will happen",
            authorName: "samuel",
            content: "don't just sit there do something"
        };

        it("must update existing article based on its id", (done) => {
            chai.request(app)
                .patch(`/article/${articleId}/update`)
                .set('Authorization', `Bearer ${token}`)
                .send(updatedArticle)
                .end( (err, res) => {
                    if(err) return done(err);
                    expect(res.status).to.equal(200);
                    //expect(res.body).to.have.property("");
                    return done();
                });
        });
    });


    describe("POST API /article/{id}/comment", () => {
        const comment = {comment:"this is a comment"};

        it("it should add comment to specific article by using article's id", (done) => {
            chai.request(app)
                .post(`/article/${articleId}/comment`)
                .set('Authorization', `Bearer ${token}`)
                .send(comment)
                .end( (err, res)=> {
                    if(err, res) return done(err);
                    expect(res).to.have.status(200);
                    return done();
                });

        });
    });

    describe("GET API /article/comment/{id}", ()=>{
        it("it should return all comments of specified article's id", (done) => {
            chai.request(app)
                .get(`/article/comment/${articleId}`)
                .send()
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    return done();
                });
        });

        it("it should return 404 when article NOT found", (done) => {
            chai.request(app)
                .get(`/article/comment/${fakeArticleId}`)
                .send()
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(404);
                    return done();
                });
        });
    });

    describe("DELETE API /article/{id}", () => {
        it("must delete article based on its id", (done) => {
            chai.request(app)
                .delete(`/article/${articleId}`)
                .set('Authorization',`Bearer ${token}`)
                .send()
                .end( (err, res) => {
                    if(err) return done(err);
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.property('message');
                    return done();
                });
        });

       
    });
});

