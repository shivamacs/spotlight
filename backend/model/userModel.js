// model factory returns the functions required to be called by different entities. Here, entity is 'user'
let { createEntity, getEntityById, updateEntityById, deleteEntityById } = require('../utility/modelFactory');

const create = createEntity('user');
const getById = getEntityById('user');
const updateById = updateEntityById('user');
const deleteById = deleteEntityById('user');

module.exports = {
    create,
    getById,
    updateById,
    deleteById
}