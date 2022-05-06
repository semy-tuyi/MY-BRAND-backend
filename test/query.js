const app = require('../index');
const chai = require('chai');
const {expect} = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
require('dotenv/config');

chai.use(chaiHttp);
let token = "";
let query = "";

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

describe("POST API /query", () => {
    before(() => {
        mongoose.connection.dropCollection("query");
    });

    const message = {
        name: "Samuel",
        email: "samuel@gmail.com",
        message: "never say never"
    };

    it("should successfully create a message and return 200", (done) => {
        chai.request(app)
            .post("/query")
            .send(message)
            .end((err, res) => {
                if(err) return done(err);
                expect(res.status).to.be.equal(200);
                
                return done();
            });
    });
});

// login first to get token so that you can get available queries
describe("POST API /users/login", () => {
    afterEach(()=>{
        mongoose.connection.dropCollection("users")
    })
    const user = {
        email: "tuyisengesamy6@gmail.com",
        password: "semytuyi"
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

   
   
    
    describe('GET API /query', () => {
       
        it("should successfully get all queries and return 200", (done) => {
            chai.request(app)
                .get("/query")
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("array")
                    return done();
                });
        });
    });

    const queryId = '6274f1b1ea3f697ab86fc43a'

    describe('GET API /query/{id}', () => {
       
        /*it("should successfully get a single query and return 200", (done) => {
            chai.request(app)
                .get(`/query/${queryId}`)
                .set("Authorization", `Bearer ${token}`)
                .end((err, res) => {
                    if(err) return done(err);
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a("object")
                    return done();
                });
        });*/

        it("when query doen't exist should  return 404", (done) => {
            chai.request(app)
            .get(`/query/${queryId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if(err) return done(err);
                expect(res).to.have.status(404);
                return done();
            });
        });

    }); 

    describe('DELETE API /query/{id}',() => {
        it("should delete query successfuly and return 200", (done) => {
            chai.request(app)
            .delete(`/query/${queryId}`)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
                if(err) return done(err);
                expect(res).to.have.status(200);
                return done();
            });
        })

      
       
    })


});

