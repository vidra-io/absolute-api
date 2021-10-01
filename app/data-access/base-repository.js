function mapId(entity) {
    if (!entity) return entity
    const mapped = {
        ...entity,
        id: entity._id ? entity._id.toString() : undefined,
    }
    delete mapped._id
    delete mapped.__v
    return mapped
}

function baseRepositoryModule(Model) {
    if (!Model) {
        throw new Error('Model param is required')
    }

    async function create(tenantId, entity) {
        const now = new Date()
        return mapId(
            (
                await Model.create({
                    _id: entity.id,
                    ...entity,
                    created_at: now,
                    last_update_at: now,
                    tenant_id: tenantId,
                })
            ).toObject(),
        )
    }
    async function findById(tenantId, id) {
        if (!id) return null
        return mapId(await Model.findById(id).lean())
    }
    async function findByIdAndUpdate(tenantId, id, data) {
        return mapId(
            await Model.findByIdAndUpdate(
                id,
                { ...data, last_update_at: new Date() },
                { new: true },
            ).lean(),
        )
    }
    async function find(tenantId, filter = {}, pagination, sort) {
        if (tenantId) {
            filter.tenant_id = tenantId
        }
        let query = Model.find(filter)
        if (pagination && pagination.offset) {
            query = query.skip(pagination.offset)
        }
        if (pagination && pagination.limit) {
            query = query.limit(pagination.limit)
        }
        if (sort) {
            query = query.sort(sort)
        }
        return (await query.lean()).map(mapId)
    }
    async function findOne(tenantId, filter = {}) {
        if (tenantId) {
            filter.tenant_id = tenantId
        }
        return mapId(await Model.findOne(filter).lean())
    }
    async function findOneAndUpdate(tenantId, filter = {}, data, options = { upsert: false }) {
        if (tenantId) {
            filter.tenant_id = tenantId
        }
        return mapId(
            await Model.findOneAndUpdate(
                filter,
                { ...data, last_update_at: new Date() },
                { ...options, new: true },
            ).lean(),
        )
    }
    async function deleteMany(tenantId, filter = {}) {
        if (tenantId) {
            filter.tenant_id = tenantId
        }
        return Model.deleteMany(filter)
    }
    async function count(tenantId, filter = {}) {
        if (tenantId) {
            filter.tenant_id = tenantId
        }
        return Model.count(filter)
    }

    return Object.freeze({
        findById,
        findByIdAndUpdate,
        find,
        findOne,
        create,
        findOneAndUpdate,
        deleteMany,
        count,
    })
}

module.exports = baseRepositoryModule
