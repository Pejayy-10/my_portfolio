"use server";

export async function getGitHubCommits() {
  const token = process.env.GITHUB_PAT;
  const username = "Pejayy-10"; // Defaulting to the repo owner, or we could fetch the viewer's login
  
  if (!token) {
    // Return mock data if no token is present
    return Array.from({ length: 52 }, () =>
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
    );
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          query {
            user(login: "${username}") {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      contributionCount
                      date
                    }
                  }
                }
              }
            }
          }
        `,
      }),
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    const json = await response.json();
    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

    if (!weeks) {
      throw new Error("No data returned from GitHub");
    }

    // Map GitHub data into our 52x7 intensity array (0 to 4)
    // GitHub provides exact commit counts. We'll map them to an intensity level.
    const mappedWeeks = weeks.slice(-52).map((week: any) => {
      // Pad to 7 days if the week is incomplete (e.g. current week)
      const days = week.contributionDays.map((day: any) => {
        const count = day.contributionCount;
        if (count === 0) return 0;
        if (count <= 2) return 1;
        if (count <= 5) return 2;
        if (count <= 10) return 3;
        return 4;
      });
      
      // Ensure exactly 7 days by padding with 0s at the end if needed
      while(days.length < 7) {
        days.push(0);
      }
      return days;
    });

    // Ensure we always return exactly 52 weeks
    while(mappedWeeks.length < 52) {
      mappedWeeks.unshift(Array(7).fill(0));
    }

    return mappedWeeks;
  } catch (error) {
    console.error("Error fetching GitHub commits:", error);
    // Fallback to mock data
    return Array.from({ length: 52 }, () =>
      Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
    );
  }
}
