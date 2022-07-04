const User = require('../models/UserModel');


module.exports.addToLikedMovies = async (req, res) => {
    try {
        const {email, data} = req.body;
        const user = await User.findOne({email});
        if (user) {
            const {likedMovies} = user;
            const movieAlreadyLiked = likedMovies.find(({id}) => (id === data.id));
            if (!movieAlreadyLiked) {
                await User.findByIdAndUpdate(user._id,
                    {
                        likedMovies: [...user.likedMovies, data]
                    },
                    {new: true}
                );
            } else return res.json({msg: "Movie alreadt added to the liked list"});
        } else await User.create({email, likedMovies: [data]});

        return res.json({msg: 'Movie added successfully'})
    } catch (e) {
        return res.json({msg: "Error adding movie"})
    }
}

module.exports.getLikedMovies = async (req, res) => {
    try {
        const {email} = req.params;
        const user = await User.findOne({email});
        if (user) {
            res.json({msg: 'success', movies: user.likedMovies})
        } else return res.json({mgs: 'User with givern email not found'})
    } catch (e) {
        return res.json({msg: 'Error fetching movie'})
    }
}


module.exports.removeFromLikedMovies = async (req, res) => {
    try {
        const {email, movieId} = req.body;
        const user = await User.findOne({email});
        if (user) {
            const movieIndex = user.likedMovies.findIndex(({id}) => (id === movieId))
            if (!movieIndex) res.status(400).send({mgs: 'Movie not found'})
            user.likedMovies.splice(movieIndex, 1);
            await User.findByIdAndUpdate(
                user._id,
                {
                    likedMovies:user.likedMovies
                },
                {new: true}
            );
            return res.json({msg: 'Movie Deleted', movies: user.likedMovies})
        }
    } catch (e) {
        return res.json({msg: 'Error deleting movie'})
    }
}