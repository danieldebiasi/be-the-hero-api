const connection = require('../database/connection');

module.exports = {
    async find(request, response) {
        const id = request.headers.authorization;

        const ong = await connection('ongs')
            .where('id', id)
            .select('*')
            .first();  

        const incidents = await connection('incidents')
            .where('ong_id', id)
            .select([
                'incidents.id',
                'incidents.title',
                'incidents.description',
                'incidents.value'
            ]);
     
        return response.json({ profile: {ong, incidents }});
    }
}