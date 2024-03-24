const Credentials = require("../Credentials");
const { Request } = require("../utils/RequestUtil");
const IgPreviewUser = require("./IgPreviewUser");

class IgUser {
    
    /**
     * 
     * @param {string} id 
     * @param {string} username 
     * @param {string} fullName 
     * @param {string[]} pronouns 
     * @param {string} biography 
     * @param {boolean} isPrivate 
     * @param {boolean} isVerified 
     * @param {boolean} isBusiness 
     * @param {boolean} isProfessional 
     * @param {boolean} isBlockedByViewer 
     * @param {boolean} isFollowedByViewer 
     * @param {boolean} isFollowingViewer 
     * @param {number} highlightReelCount 
     * @param {{ count: number, edges: [] }} mutualFollowedBy
     * @param {{ count: number }} following 
     * @param {{ count: number }} followers 
     * @param {string} profilePictureUrl 
     * @param {string} profilePictureUrlHd 
     */
    constructor(
        id,
        username,
        fullName,
        pronouns,
        biography,
        isPrivate,
        isVerified,
        isBusiness,
        isProfessional,
        isBlockedByViewer,
        isFollowedByViewer,
        isFollowingViewer,
        highlightReelCount,
        mutualFollowedBy,
        following,
        followers,
        profilePictureUrl,
        profilePictureUrlHd,
    ) { 
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.pronouns = pronouns;
        this.biography = biography;
        this.isPrivate = isPrivate;
        this.isVerified = isVerified;
        this.isBusiness = isBusiness;
        this.isProfessional = isProfessional;
        this.isBlockedByViewer = isBlockedByViewer;
        this.isFollowedByViewer = isFollowedByViewer;
        this.isFollowingViewer = isFollowingViewer;
        this.highlightReelCount = highlightReelCount;
        this.mutualFollowedByCount = mutualFollowedBy.count;
        this.followingCount = following.count;
        this.followersCount = followers.count;
        this.profilePictureUrl = profilePictureUrl;
        this.profilePictureUrlHd = profilePictureUrlHd;
    }

    /**
     * 
     * @returns {Promise<Array<IgPreviewUser>>}
     */
    async fetchFollowers() {
        let dataType = "followers";
        const followData = [];
        let config = {
            followers: {
                hash: 'c76146de99bb02f6415203be841dd25a',
                path: 'edge_followed_by'
            },
            followings: {
                hash: 'd04b0a864b4b54837c0d870b0e77e076',
                path: 'edge_follow'
            }
        };

        const configPath = config[dataType].path;
        const configHash = config[dataType].hash

        let after = null;
        let hasNextPage = true;

        while(hasNextPage) {
            const request = await new Request(`https://www.instagram.com/graphql/query/`, "get")
            .setHeaders(Credentials.headers)
            .setQuery({
                query_hash: configHash,
                variables: encodeURIComponent(JSON.stringify({
                    "id": this.id,
                    "include_reel": true,
                    "fetch_mutual": true,
                    "first": 50,
                    "after": after
                }))
            })
            .doRequest()

            const data = request.json().data;
            const edges = data.user[configPath].edges;
            const parsedEdges = edges.map(e => {
                const node = e.node;

                const { id, username, full_name, profile_pic_url, is_private, is_verified, followed_by_viewer } = node;

                return new IgPreviewUser(
                    id,
                    username,
                    full_name,
                    profile_pic_url,
                    is_private,
                    is_verified,
                    followed_by_viewer
                );
            });

            followData.push(...parsedEdges);

            hasNextPage = data.user[configPath].page_info.has_next_page;

            if(hasNextPage) {
                after = data.user[configPath].page_info.end_cursor;
            }

            await new Promise((res) => setTimeout(() => res(), 700));
        }

        return followData;
    }
}

module.exports = IgUser;