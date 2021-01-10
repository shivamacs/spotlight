// model factory returns the functions required to be called by different entities. Here, entity is 'post'
const { createEntity, getEntityById, updateEntityById, deleteEntityById } = require('../utility/modelFactory');

const create = createEntity('post');
const getById = getEntityById('post');
const updateById = updateEntityById('post');
const deleteById = deleteEntityById('post');

module.exports = {
    create,
    getById,
    updateById,
    deleteById
}