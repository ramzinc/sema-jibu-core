process.env.NODE_ENV = 'test';
const chai = require('chai');

const should = chai.should();
const expect = require('chai').expect;

const app = require('../bin/www');
const request = require('supertest')(app);
const db = require('../models');

describe('Products', () => {
  let token;
  let category;
  let kiosk;
  let salesChannel;
  let createdProduct;

  before(async () => {
    const product = await db.product.findOne({
      where: { name: 'unittests_product123' },
    });

    if (product) {
      const productMrp = await db.product_mrp.findOne({
        where: { product_id: product.id },
      });
      await productMrp.destroy();
      await product.destroy();
    }
    category = await db.product_category.findOne();
    kiosk = await db.kiosk.findOne();
    salesChannel = await db.sales_channel.findOne();
  });

  after(async () => {
    const product = await db.product.findOne({
      where: { name: 'unittests_product123' },
    });

    if (product) {
      const productMrp = await db.product_mrp.findOne({
        where: { product_id: product.id },
      });
      await productMrp.destroy();
      await product.destroy();
    }
  });

  beforeEach((done) => {
    request
      .post('/sema/login')
      .send({ usernameOrEmail: 'administrator', password: 'dloHaiti' })
      .end((err, res) => {
        if (err) throw err;
        token = res.body.token;
        done();
      });
  });

  describe('/GET products', () => {
    it('it should get all the products', (done) => {
      request
        .get('/sema/admin/products')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('products');
          res.body.products.should.be.a('array');
          done();
        });
    });
  });
  describe('/POST product', () => {
    it('should create a product', (done) => {
      const postProduct = {
        active: 1,
        name: 'unittests_product123',
        sku: 'unittestproduct',
        description: 'unittests_product123',
        category: category.id,
        priceAmount: 1,
        priceCurrency: 'USD',
        minQuantity: 1,
        maxQuantity: 1,
        unitsPerProduct: 1,
        unitMeasurement: 'tons',
        costOfGoods: 1,
        image: 'base64image',
        productMrp: [
          {
            active: 1,
            kioskId: kiosk.id,
            salesChannelId: salesChannel.id,
            priceAmount: 1,
          },
        ],
      };
      request
        .post('/sema/admin/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ data: postProduct })
        .expect(200)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('product');
          const product = res.body.data.product;
          createdProduct = res.body.data.product;
          product.should.have.property('name');
          expect(product.name).to.equal('unittests_product123');
          product.should.have.property('sku');
          expect(product.sku).to.equal('unittestproduct');
          product.should.have.property('category');
          product.should.have.property('priceAmount');
          expect(product.priceAmount).to.equal(1);
          product.should.have.property('priceCurrency');
          expect(product.priceCurrency).to.equal('USD');
          product.should.have.property('minQuantity');
          expect(product.minQuantity).to.equal(1);
          product.should.have.property('maxQuantity');
          expect(product.maxQuantity).to.equal(1);
          product.should.have.property('unitsPerProduct');
          expect(product.unitsPerProduct).to.equal(1);
          product.should.have.property('unitMeasurement');
          expect(product.unitMeasurement).to.equal('tons');
          product.should.have.property('costOfGoods');
          expect(product.costOfGoods).to.equal(1);
          product.should.have.property('productMrp');
          const productMrp = product.productMrp;
          productMrp.should.be.a('array');
          productMrp[0].should.have.property('kioskId');
          productMrp[0].should.have.property('salesChannelId');
          productMrp[0].should.have.property('priceAmount');
          done();
        });
    });
  });
  describe('/PUT product', () => {
    it('should update a product', (done) => {
      const putProduct = {
        active: true,
        name: 'unittests_product123',
        sku: 'unittestproduct',
        description: 'PUT_unittests_product123',
        category: category.id,
        priceAmount: 1,
        priceCurrency: 'USD',
        minQuantity: 1,
        maxQuantity: 1,
        unitsPerProduct: 1,
        unitMeasurement: 'tons',
        costOfGoods: 1,
        image: 'base64image',
        productMrp: [],
      };
      request
        .put(`/sema/admin/products/${createdProduct.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ data: putProduct })
        .expect(200)
        .end((err, res) => {
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.have.property('product');
          const product = res.body.data.product;
          product.should.have.property('description');
          product.description.should.equal(
            'PUT_unittests_product123',
          );
          done();
        });
    });
  });

  describe('/DELETE product', () => {
    it('should delete a product', (done) => {
      request
        .delete(`/sema/admin/products/${createdProduct.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.a('object');
          done();
        });
    });
  });
});
