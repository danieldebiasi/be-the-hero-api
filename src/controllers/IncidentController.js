const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [result] = await connection('incidents').insert({
            ong_id,
            title,
            description,
            value
        });

        return response.json({ result });
    },

    async findAll(request, response) {
        const { page = 1 } = request.query;

        const [pages] = await connection('incidents')
            .count();

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        response.header('X-Total-Count', pages['count(*)']);

        return response.json({ incidents });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id !== ong_id) {
            return response.status(401).json({
                error: 'Operation not allowed.'
            });
        }

        await connection('incidents')
            .where('id', id)
            .delete();

        return response.status(204).send();
    }
}