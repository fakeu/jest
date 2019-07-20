import fs from "fs";
import CartParser from "./CartParser";

let parser, parse, readFile, validate, parseLine, calcTotal, createError;

beforeEach(() => {
  parser = new CartParser();
  parse = parser.parse.bind(parser);
  readFile = parser.readFile.bind(parser);
  validate = parser.validate.bind(parser);
  parseLine = parser.parseLine.bind(parser);
  calcTotal = parser.calcTotal.bind(parser);
  createError = parser.createError.bind(parser);
});

describe("CartParser - unit tests", () => {
  // Add your unit tests here.
  it("should return a number of total price equal 348.32", () => {
    const data = JSON.parse(fs.readFileSync("./samples/cart.json"));

    expect(Number(calcTotal(data.items).toFixed(2))).toEqual(348.32);
  });

  it("should return the correct result of parsing line", () => {
    const data = parseLine("Mollis consequat,9.00,2");

    expect(data).toMatchObject({
      name: "Mollis consequat",
      price: 9,
      quantity: 2
    });
  });

  it("should return empty array when data is valid", () => {
    expect(
      validate("Product name,Price,Quantity\nMollis consequat,9.00,2")
    ).toEqual([]);
  });

  it("should return 4 errors, one error in each line", () => {
    const fakeData =
      ",Price,Quantity\n9.00,2\nTvoluptatem,-10.32,1\nScelerisque lacinia,18.90";
    expect(validate(fakeData)).toHaveLength(4);
  });
});

describe("CartParser - integration test", () => {
  // Add your integration test here.
  it("should return true if the data is processed correctly", () => {
    const data = "./samples/cart.csv";

    expect(parse(data)).toMatchObject({
      items: [
        {
          name: "Mollis consequat",
          price: 9,
          quantity: 2
        },
        {
          name: "Tvoluptatem",
          price: 10.32,
          quantity: 1
        },
        {
          name: "Scelerisque lacinia",
          price: 18.9,
          quantity: 1
        },
        {
          name: "Consectetur adipiscing",
          price: 28.72,
          quantity: 10
        },
        {
          name: "Condimentum aliquet",
          price: 13.9,
          quantity: 1
        }
      ],
      total: 348.32
    });
  });
});
