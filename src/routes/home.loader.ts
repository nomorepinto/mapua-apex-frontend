export async function loader() {
  return {
    message: "Home route loaded with a React Router loader.",
    loadedAt: new Date().toISOString(),
  }
}

export type HomeLoader = typeof loader
