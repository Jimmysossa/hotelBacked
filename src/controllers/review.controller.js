const catchError = require('../utils/catchError');
const Review = require('../models/Review');
const User = require('../models/User');

const getAll = catchError(async(req, res) => {
    const { hotelId, userId, offset, perPage } = req.query;
    const where = {};
    if (hotelId) where.hotelId = hotelId;
    if (userId) where.userId = userId;
    const results = await Review.findAll({ include: [{
        model: User,
        attributes: { 
            exclude:['password']}
        }],
        where,
        offset: offset,
        limit:perPage,
    });
    const total = await Review.count({ where: where});
    return res.json({total, results});
});

const create = catchError(async(req, res) => {
    const { rating, hotelId, comment } = req.body;
    const userId = req.user.id;
    const result = await Review.create({ rating, hotelId, userId, comment});
    console.log(hotelId);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Review.findByPk(id, { include: [User]});
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Review.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Review.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}