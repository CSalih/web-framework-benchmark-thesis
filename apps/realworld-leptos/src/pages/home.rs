use crate::auth;
use crate::components::ArticlePreviewList;
use crate::models::{Article, Pagination, Tag};
use leptos::prelude::*;

/// Renders the home page of your application.
#[component]
pub fn HomePage() -> impl IntoView {
    let auth_context = expect_context::<auth::AuthContext>();

    let (pagination, set_pagination) = signal(Pagination::default());
    let articles_res = LocalResource::new(move || Article::load_articles(pagination.get()));

    let your_feed_class = move || {
        format!(
            "nav-link {}",
            if auth_context.user.with(Option::is_none) {
                "disabled"
            } else if !pagination.get().get_my_feed() {
                "active"
            } else {
                ""
            }
        )
    };
    let pages = move || {
        let articles_res_opt = articles_res.get();
        if let Some(articles_res) = articles_res_opt.as_deref() {
            let max_page = (articles_res.articles_count as f64
                / pagination.get().get_amount() as f64)
                .ceil() as u32;
            (1..=max_page).collect::<Vec<u32>>()
        } else {
            vec![]
        }
    };

    view! {
        <div class="home-page">
            <div class="banner">
                <div class="container">
                    <h1 class="logo-font">conduit</h1>
                    <p>"A place to share your knowledge."</p>
                </div>
            </div>

            <div class="container page">
                <div class="row">
                    <div class="col-md-9">
                        <div class="feed-toggle">
                            <ul class="nav nav-pills outline-active">
                                <Show when=move || { auth_context.user.with(Option::is_none) }>
                                    <li class="nav-item">
                                        <button
                                            class=your_feed_class
                                            class:active=move || { pagination.get().get_my_feed() }
                                            on:click=move |_| {
                                                let pagination = pagination
                                                    .get()
                                                    .clone()
                                                    .reset_page()
                                                    .set_my_feed(true);
                                                set_pagination.set(pagination);
                                            }
                                        >
                                            "Your Feed"
                                        </button>
                                    </li>
                                </Show>
                                <li class="nav-item">
                                    <button
                                        class="nav-link"
                                        class:active=move || { !pagination.get().get_my_feed() }
                                        on:click=move |_| {
                                            let pagination = pagination
                                                .get()
                                                .clone()
                                                .reset_page()
                                                .set_my_feed(false);
                                            set_pagination.set(pagination);
                                        }
                                    >
                                        "Global Feed"
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <Transition fallback=|| {
                            view! { <p>"Loading articles"</p> }
                        }>
                            {move || {
                                articles_res
                                    .get()
                                    .as_deref()
                                    .map(|articles_res| {
                                        let (articles, _) = signal(articles_res.articles.clone());
                                        view! { <ArticlePreviewList articles=articles /> }
                                    })
                            }}
                        </Transition>
                    </div>

                    <div class="col-md-3">
                        <div class="sidebar">
                            <p>"Popular Tags"</p>
                            <Transition fallback=|| view! { <p>"Loading popular tags"</p> }>
                                <TagList />
                            </Transition>
                        </div>
                    </div>

                    <ul class="pagination">
                        <For
                            each=move || pages()
                            key=|x| *x
                            children=move |x| {
                                let active = x == pagination.get().get_page();
                                view! {
                                    <li class="page-item" class:active=move || active>
                                        <button
                                            class="page-link"
                                            on:click=move |_| {
                                                let pagination = pagination.get().clone().set_page(x);
                                                set_pagination.set(pagination);
                                            }
                                        >
                                            {x}
                                        </button>
                                    </li>
                                }
                            }
                        />
                    </ul>
                </div>
            </div>
        </div>
    }
}

#[component]
fn TagList() -> impl IntoView {
    let tags_res = LocalResource::new(Tag::load_tags);

    view! {
        <div class="tag-list">
            <Suspense fallback=move || view! { <p>"Loading Tags"</p> }>
                <ErrorBoundary fallback=|_| {
                    view! { <p class="error-messages text-xs-center">"Something went wrong."</p> }
                }>
                    {move || {
                        tags_res
                            .get()
                            .map(move |tags_res| {
                                view! {
                                    <For
                                        each=move || {
                                            tags_res.tags.clone().into_iter().enumerate()
                                        }
                                        key=|(i, _)| *i
                                        children=move |(_, tag): (usize, String)| {
                                            view! {
                                                <a class="tag-pill tag-default" href="">
                                                    {tag}
                                                </a>
                                            }
                                        }
                                    />
                                }
                            })
                    }}
                </ErrorBoundary>
            </Suspense>
        </div>
    }
}
