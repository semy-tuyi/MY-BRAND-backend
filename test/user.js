const app = require('../index');
const chai = require('chai');
const {expect} = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
require('dotenv/config');

chai.use(chaiHttp);
let token = "";

describe("POST API /users", () =>{
   /* before(()=>{
        mongoose.connection.dropCollection("users");
    })

    afterEach(() =>{
        mongoose.connection.dropCollection('users');
    });*/

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

    it("should return 409 when email exists", (done) => {
        const oldUser = user.email;
        chai.request(app)
            .post("/users")
            .send(user)
            .end((err, res) => {
                if (oldUser) return done(err);
                expect(res.status).to.have.status(409);
                return done();
            });
    });

});

describe("POST API /users/login", () => {
    before(() => {
        mongoose.connection.dropCollection("users");
    });

    afterEach(()=>{
        mongoose.connection.dropCollection('users');
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
                //expect(res.body).to.have.property("success");
                //expect(res.body).to.have.property("message");
                expect(res.body).to.have.property("token");
                return done();
            });
    });

    it("should deny access because of invalid credentials", (done) => {
        chai.request(app)
            .post("/users/login")
            .send(user1)
            .end((err, res) => {
                expect(res).to.have.status(400);
                return done();
            });
    });

    describe("GET API /users/get", () => {
        it("should return list of all users", (done) => {
            chai.request(app)
                .get("/users/get")
                .set("Authorization", `Bearer ${token}`)
                .send()
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("success");
                    expect(res.body).to.have.property("data");
                    return done();
                });
        });


    });

    describe("DELETE API /user/id", ()=>{
        const userId = "1229b52ca50601182da72457";
        it("Should delete a user according to id", (done) =>{
            chai.request(app)
                .delete(`/users/${userId}`)
                .set("Authorization", `Bearer ${token}`)
                .send()
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("data");
                    return done();
                })
        })

        it("Return 404 when user not found", (done) => {
        const userId = "1229b52ca50601182da72457";

        chai.request(app)
            .delete(`/users/${userId}`)
            .set("Authorization", `Bearer ${token}`)
            .send()
            .end((err, res) => {
                if(err) return done(err);
                expect(res).to.have.status(404);
                return done();
            })
        })
    });

});