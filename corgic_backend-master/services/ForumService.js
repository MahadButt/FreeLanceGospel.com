const logger = require("../loaders/logger");

const ForumTopic = require("../models/ForumTopic");
const ForumSection = require("../models/ForumSection");
const ForumPost = require("../models/ForumPost");
const ForumReply = require("../models/ForumReply");

const forumService = {

    createPost: async function(u_id, data) {

        try {

            const result = await ForumPost
                .query()
                .insert({
                    u_id,
                    topic_id: data.topic_id,
                    section_id: data.section_id,
                    title: data.title,
                    body: data.body
                });

            if (result) {
                return { success: true, id: result.id };
            }
            
        } catch (err) {
            logger.error(err);
        }
    },

    prepareForumPage: async function(filters) {
        
        try {
            let per_page=filters.per_page||20
            let current_page=filters.page||1
            let ofset=(current_page-1)*per_page
            const [count,posts, topics] = await Promise.all([
                ForumPost.query().count("id as count").where({ active: 1 }),
                ForumPost.query().orderBy("created_at", "desc").where({ active: 1 }).offset(ofset).limit(per_page),
                ForumTopic.query().where({ active: 1 }).orderBy("topic_name", "asc")
                // ForumTopic.query().eager("sections").where({ active: 1 }).orderBy("topic_name", "asc")
            ]);
            // for (let i = 0; i < topics.length; i++) {
            //     const forumSections = await ForumSection.query().where({ topic_id: topics[i].id, active: 1 });
            //     topics[i].sections = forumSections
            // }
            const counts = await Promise.all(
                posts.map((post) => {
                    return ForumReply.query().count("id as replies").findOne({ post_id: post.id });
                })
            );

            const lastReply = await Promise.all(
                posts.map((post) => {
                    return ForumReply
                        .query()
                        .select("created_at")
                        .eager("user")
                        .findOne({ post_id: post.id })
                        .orderBy("created_at", "desc")
                        .limit(1);
                })
            );

            posts.forEach((post, index) => {
                post.replies = counts[index] ? counts[index].replies : null;
                post.lastReply = lastReply[index] ? lastReply[index] : null;
            });

            // Sort sections in alphabetical order
            // topics.forEach(topic => {

            //     const sortedSections = topic.sections.sort((a, b) => {
            //         if (a.section_name < b.section_name) { return -1; }
            //         if (a.section_name > b.section_name) { return 1; }
            //         return 0;
            //     });

            //     topic.sections = sortedSections;
            // });

            return {
               count:count[0].count,
                posts,
                topics
            };

        } catch (err) {
            logger.error(err);
        }
    },
    getTopicPost: async function(filters,topic_id) {
        
        try {
            let per_page=filters.per_page;
            let current_page=filters.page||1
            let ofset=(current_page-1)*per_page
            const [count,posts] = await Promise.all([
                ForumPost.query().count("id as count").where({ topic_id:topic_id, active: 1 }),
                ForumPost.query().orderBy("created_at", "desc").where({ topic_id:topic_id, active: 1 }).offset(ofset).limit(per_page)
            ]);

            return {
                success:true,
                count:count[0].count,
                posts
            };

        } catch (err) {
            logger.error(err);
        }
    },

    getSectionPosts: async function(topic_id, section_id) {

        try {
            
            const [posts, section] = await Promise.all([
                ForumPost.query().where({ topic_id, section_id }),
                ForumSection.query().select("section_name").findOne({ id: section_id })
            ]);

            const counts = await Promise.all(
                posts.map((post) => {
                    return ForumReply.query().count("id as replies").findOne({ post_id: post.id });
                })
            );

            const lastReply = await Promise.all(
                posts.map((post) => {
                    return ForumReply
                        .query()
                        .select("created_at")
                        .eager("user")
                        .findOne({ post_id: post.id })
                        .orderBy("created_at", "desc")
                        .limit(1);
                })
            );

            posts.forEach((post, index) => {
                post.replies = counts[index] ? counts[index].replies : null;
                post.lastReply = lastReply[index] ? lastReply[index] : null;
            });

            return {
                posts,
                section
            };

        } catch (err) {
            logger.error(err);
        }
    },

    getPostById: async function(post_id, u_id) {
        
        try {

            let post = null;
            
            if (post_id !== "none") {
                
                post = await ForumPost
                    .query()
                    .eager("[user, replies.user]")
                    .findOne({ id: post_id });

                ForumPost
                    .query()
                    .where({ id: post_id })
                    .increment("views", 1)
                    .then(() => null)
                    .catch((err) => logger.error(err));
                
            } else if (u_id) {

                post = await ForumPost.query()
                    .eager("[user]")
                    .orderBy("created_at", "desc")
                    .where({ u_id });
            }

            return post;

        } catch (err) {
            logger.error(err);
        }
    },

    postSearch: async function(searchKey) {

        try {
         
            const posts = await ForumPost
                .query()
                .eager("user")
                .orWhere("title", "like", `%${searchKey}%`)
                .orWhere("body", "like", `%${searchKey}%`);

            return posts;

        } catch (err) {
            logger.error(err)
        }
    },

    postReply: async function(data, u_id) {

        try {

            const result = await ForumReply.query().insert({
                u_id,
                post_id: data.post_id,
                reply: data.reply
            });

            if (!result) {
                return { success: false };
            }

            return { success: true };
            
        } catch (err) {
            logger.error(err);
            return { success: false,msg:err.message };
        }
    },

    deleteForumPost:async function(u_id,forumId){
        try{
            const result=await ForumPost.query().where({id:forumId,u_id:u_id})
            if(result.length>0){
                await ForumPost.query().delete().where({id:forumId,u_id:u_id})
                return {success:true}
            }
            else{
                return {success:false}
            }
        }
        catch(err){
            logger.error(err)
            return { success: false,msg:err.message };
        }
    },
    updateForumPost:async function(u_id,data,forumId,isAdmin){
        try{
            let response;
            if(isAdmin){
                response= await ForumPost.query().update(data).where({id:forumId})
            }
            else{
                response= await ForumPost.query().update(data).where({id:forumId,u_id:u_id})
            }
            if (response && response > 0) {
                return {
                    success: true,
                };
            } else {
                return {
                    success: false,
                    msg: "Forum not updated,Try again later"
                }
            }
        }
        catch(err){
            logger.error(err)
            return {success:false,msg:err.message}
        }
    }
}

module.exports = forumService;