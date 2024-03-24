const Credentials = require("../../Credentials");
const { Request } = require("../../utils/RequestUtil");
const IgUser = require("../IgUser");

class UserRequests {
    /**
     * @param {string} username 
     * @returns {Promise<IgUser>}
     */
    async getByUsername(username) {
        const request = await new Request(`https://www.instagram.com/api/v1/users/web_profile_info/`, "get")
        .setQuery({ username: username })   
        .setHeaders(Credentials.headers)
        .doRequest();

        const data = request.json().data.user;
        const { id, full_name, pronouns, biography, is_private, is_verified, is_business_account, is_professional_account, blocked_by_viewer, followed_by_viewer, follows_viewer, highlight_reel_count, profile_pic_url, profile_pic_url_hd, edge_mutual_followed_by, edge_follow, edge_followed_by } = data;

        return new IgUser(    
            id,
            username,
            full_name,
            pronouns,
            biography,
            is_private,
            is_verified,
            is_business_account,
            is_professional_account,
            blocked_by_viewer,
            followed_by_viewer,
            follows_viewer,
            highlight_reel_count,
            edge_mutual_followed_by,
            edge_follow,
            edge_followed_by,
            profile_pic_url,
            profile_pic_url_hd,
        );
    }

    
}

module.exports = UserRequests;