require("jasmine");
require("./server");
const frisby = require("frisby");
const Joi = frisby.Joi;

describe("Test API Calls", () => {
    it("Authentication Token Generation", () => {
        return frisby
            .post("http://localhost:3000/authentication", {
                username: "roque.ribeiro",
                password: "rb1234"
            })
            .expect("header", "Content-Type", "application/json; charset=utf-8")
            .expect("status", 200)
            .then(function (results) {
                return frisby
                    .get("http://localhost:3000/users/1", {
                        headers: {
                            "Authorization": results._json.token
                        }
                    })
                    .expect("header", "Content-Type", "application/json; charset=utf-8")
                    .expect("status", 200)
                    .expect('jsonTypes', 'results.*', {
                        "code": Joi.number(),
                        "clinic": Joi.number(),
                        "name": Joi.string(),
                        "surname": Joi.string().allow(''),
                        "login": Joi.string(),
                        "type": Joi.number(),
                        "level": Joi.number()
                    });
            })
    });

    // it("Test method POST", () => {
    //     return frisby
    //         .post("http://localhost:3000/users", {
    //             name: "Nova Tarefa",
    //             status: "completed"
    //         })
    //         .expect("header", "Content-Type", "application/json; charset=utf-8")
    //         .expect("status", 200);
    // });

    // it("Test method GET", () => {
    //     return frisby
    //         .get("http://localhost:3000/users", {
    //             "x-access-token": ""
    //         })
    //         .expect("header", "Content-Type", "application/json; charset=utf-8")
    //         .expect("status", 200);
    // });

    // it("Test method GET with search", () => {
    //     return frisby
    //         .get("http://localhost:3000/users/1")
    //         .expect("header", "Content-Type", "application/json; charset=utf-8")
    //         .expect("status", 200);
    // });

    // it("Test method PUT", () => {
    //     return frisby
    //         .put("http://localhost:3000/users/1", {
    //             name: "Tarefa Alterada",
    //             status: "pending"
    //         })
    //         .expect("header", "Content-Type", "application/json; charset=utf-8")
    //         .expect("status", 200);
    // });

    // it("Test method DELETE", () => {
    //     return frisby
    //         .del("http://localhost:3000/users/4")
    //         .expect("header", "Content-Type", "application/json; charset=utf-8")
    //         .expect("status", 200);
    // });

});