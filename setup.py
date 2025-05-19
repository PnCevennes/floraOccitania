import setuptools
from pathlib import Path


root_dir = Path(__file__).absolute().parent
with (root_dir / "VERSION").open() as f:
    version = f.read().strip()

setuptools.setup(
    name="flora_occitania",
    description="",
    long_description="Affichage et saisie de données éthonobotaniques en Occitan",
    long_description_content_type="text/markdown",
    maintainer="Parc national des Cévennes",
    maintainer_email="admin_si@cevennes-parcnational.fr",
    url="https://github.com/PnX-SI/Flora_occitania/",
    python_requires=">=3.8",
    version=version,
    packages=setuptools.find_packages(where="backend", include=["flora_occitania"]),
    package_dir={
        "": "backend",
    },
    install_requires=list(
        open("backend/requirements.txt", "r"),
    ),
    extras_require={
        "tests": [
            "pytest",
            "pytest-flask",
            "pytest-benchmark",
            "pytest-cov",
        ],
        "doc": [],
    },
    classifiers=[
        "Framework :: Flask",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
    ],
)
