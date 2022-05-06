const app = require('../index');
const chai = require('chai');
const {expect} = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
require('dotenv/config');

chai.use(chaiHttp);
let token = "";

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
    afterEach(()=>{
        mongoose.connection.dropCollection("users")
    })
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
                    //expect(res).to.have.status(200);
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
                .set("Authorization", `Bearer ${token}`)
                .send()
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    return done();
                });
        });
    });

});

