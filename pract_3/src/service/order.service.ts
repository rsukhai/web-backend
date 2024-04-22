import { Injectable } from '@nestjs/common';
import { OrderDto } from '../models';
import { Orders, OrdersDoc } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from '../models';
import { UserDontHaveAnyOrders } from 'src/shared';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name)
    private readonly orderModel: Model<OrdersDoc>,
  ) {}

  async createOrder(body: OrderDto & { login: string }) {

    const randomNumber = Math.random()
    const randomInRange = Math.floor(randomNumber * (100 - 20 + 1)) + 20
    const doc = new this.orderModel({
      ...body,
      price: randomInRange
    });

    const order = await doc.save();

    return order;
  }
  async getLowestPrice (body: UserDto){
    const findAll = await this.orderModel.find(
      {login: body.login}
    ).sort({price: 1}).limit(1) // price:1 сортує від найнижчого до найбільшого і видає 1 результат
    if (findAll.length === 0 ){
      throw new UserDontHaveAnyOrders('U dont have any orders')
    }
    return findAll
  }

  async getBiggestPrice (body: UserDto){
    const findAll = await this.orderModel.find(
      {login: body.login}
    );
    if (findAll.length === 0 ){
      throw new UserDontHaveAnyOrders('U dont have any orders')
    };
    const highestOrder = findAll.reduce((maxOrder, currentOrder) => {
      return currentOrder.price > maxOrder.price ? currentOrder : maxOrder;
    }, findAll[0]);

    return highestOrder
  }
  async getFiveLastFrom (body : UserDto){
    const last5From = []
    const uniqueFromSet = new Set();
    const FiveLastFromPoints = await this.orderModel.find(
      {login: body.login},
      
      {to: false}
    );
    for (let i = FiveLastFromPoints.length - 1; i >= 0 && uniqueFromSet.size < 5; i--) {
      const currentFrom = FiveLastFromPoints[i].from;
      // console.log(currentTo)
      if (!uniqueFromSet.has(currentFrom)) {
          uniqueFromSet.add(currentFrom);
          console.log(uniqueFromSet)
          last5From.push(currentFrom);
      }

      console.log(last5From)
  }
  return last5From
  }
  async getThreeLastTo (body : UserDto){
    const last3To = []
    const uniqueFromSet = new Set();
    const FiveLastFromPoints = await this.orderModel.find(
      {login: body.login},
      
    );
    for (let i = FiveLastFromPoints.length - 1; i >= 0 && uniqueFromSet.size < 5; i--) {
      const currentFrom = FiveLastFromPoints[i].to;
      // console.log(currentTo)
      if (!uniqueFromSet.has(currentFrom)) {
          uniqueFromSet.add(currentFrom);
          console.log(uniqueFromSet)
          last3To.push(currentFrom);
      }

  }
  return last3To
  }
  
}
